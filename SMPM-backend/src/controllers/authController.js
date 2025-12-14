const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar JWT Token
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Registrar usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;
    
    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça nome, email e senha'
      });
    }
    
    // Verificar se usuário já existe
    const usuarioExiste = await User.findOne({ email: email.toLowerCase().trim() });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }
    
    // Criar usuário
    const usuario = await User.create({
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha,
      role: role || 'operador'
    });
    
    // Gerar token
    const token = gerarToken(usuario._id);
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        token
      }
    });
  } catch (error) {
    // Tratamento de erro de validação
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Validar email e senha
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça email e senha'
      });
    }
    
    // Buscar usuário (incluindo senha)
    const usuario = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+senha');
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    // Verificar se usuário está ativo
    if (!usuario.ativo) {
      return res.status(401).json({
        success: false,
        message: 'Usuário desativado. Entre em contato com o administrador'
      });
    }
    
    // Verificar senha
    const senhaCorreta = await usuario.compararSenha(senha);
    
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    // Atualizar último acesso
    usuario.ultimoAcesso = new Date();
    await usuario.save();
    
    // Gerar token
    const token = gerarToken(usuario._id);
    
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obter usuário logado
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = async (req, res) => {
  try {
    const { nome, email } = req.body;
    
    const camposAtualizados = {};
    if (nome) camposAtualizados.nome = nome.trim();
    if (email) camposAtualizados.email = email.toLowerCase().trim();
    
    const usuario = await User.findByIdAndUpdate(
      req.usuario.id,
      camposAtualizados,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: usuario
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Atualizar senha
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça senha atual e nova senha'
      });
    }
    
    if (novaSenha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Nova senha deve ter no mínimo 6 caracteres'
      });
    }
    
    const usuario = await User.findById(req.usuario.id).select('+senha');
    
    const senhaCorreta = await usuario.compararSenha(senhaAtual);
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }
    
    usuario.senha = novaSenha;
    await usuario.save();
    
    const token = gerarToken(usuario._id);
    
    res.status(200).json({
      success: true,
      message: 'Senha atualizada com sucesso',
      data: { token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar senha',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// CRUD COMPLETO DE USUÁRIOS (ADMIN)
// ============================================

// @desc    Listar todos os usuários
// @route   GET /api/auth/users
// @access  Private/Admin
exports.listarUsuarios = async (req, res) => {
  try {
    const { role, ativo, search, page = 1, limit = 10 } = req.query;
    let query = {};
    
    // Filtros
    if (role) query.role = role;
    if (ativo !== undefined) query.ativo = ativo === 'true';
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Paginação
    const skip = (page - 1) * limit;
    
    const [usuarios, total] = await Promise.all([
      User.find(query)
        .select('-senha')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: usuarios.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Buscar usuário por ID
// @route   GET /api/auth/users/:id
// @access  Private/Admin
exports.buscarUsuario = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuário inválido'
      });
    }
    
    const usuario = await User.findById(req.params.id).select('-senha');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Criar novo usuário (Admin)
// @route   POST /api/auth/users
// @access  Private/Admin
exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;
    
    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça nome, email e senha'
      });
    }
    
    // Verificar se usuário já existe
    const usuarioExiste = await User.findOne({ email: email.toLowerCase().trim() });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }
    
    // Criar usuário
    const usuario = await User.create({
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha,
      role: role || 'operador'
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: usuario
    });
  } catch (error) {
    // Tratamento de erro de validação
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Atualizar usuário
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
exports.atualizarUsuario = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuário inválido'
      });
    }
    
    const { nome, email, role, ativo } = req.body;
    
    const camposAtualizados = {};
    if (nome) camposAtualizados.nome = nome.trim();
    if (email) camposAtualizados.email = email.toLowerCase().trim();
    if (role) camposAtualizados.role = role;
    if (ativo !== undefined) camposAtualizados.ativo = ativo;
    
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      camposAtualizados,
      { new: true, runValidators: true }
    ).select('-senha');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: usuario
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deletar usuário
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deletarUsuario = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuário inválido'
      });
    }
    
    // Não permitir deletar a si mesmo
    if (req.params.id === req.usuario.id) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode deletar sua própria conta'
      });
    }
    
    const usuario = await User.findByIdAndDelete(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Usuário deletado com sucesso',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};