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
    
    // Verificar se usuário já existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }
    
    // Criar usuário
    const usuario = await User.create({
      nome,
      email,
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
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: error.message
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
    const usuario = await User.findOne({ email }).select('+senha');
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
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
      error: error.message
    });
  }
};

// @desc    Obter usuário logado
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.id);
    
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: error.message
    });
  }
};