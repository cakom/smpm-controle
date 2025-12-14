const Machine = require('../models/Machine');
const mongoose = require('mongoose');

// Validar ObjectId
const validarObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// @desc    Criar nova máquina
// @route   POST /api/machines
// @access  Private
exports.criarMaquina = async (req, res) => {
  try {
    req.body.criadoPor = req.usuario.id;
    
    // Validação adicional
    if (!req.body.nome || !req.body.tipo || !req.body.setor || !req.body.proximaManutencao) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça todos os campos obrigatórios: nome, tipo, setor e próxima manutenção'
      });
    }
    
    const maquina = await Machine.create(req.body);
    
    // Popular criadoPor
    await maquina.populate('criadoPor', 'nome email');
    
    res.status(201).json({
      success: true,
      message: 'Máquina criada com sucesso',
      data: maquina
    });
  } catch (error) {
    // Erro de duplicação de número de série
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Número de série já cadastrado'
      });
    }
    
    // Erro de validação
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
      message: 'Erro ao criar máquina',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Listar todas as máquinas
// @route   GET /api/machines
// @access  Private
exports.listarMaquinas = async (req, res) => {
  try {
    const { status, setor, tipo, search, page = 1, limit = 10 } = req.query;
    let query = {};
    
    // Filtros
    if (status) query.status = status;
    if (setor) query.setor = { $regex: setor, $options: 'i' };
    if (tipo) query.tipo = tipo;
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { modelo: { $regex: search, $options: 'i' } },
        { fabricante: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Paginação
    const skip = (page - 1) * limit;
    
    const [maquinas, total] = await Promise.all([
      Machine.find(query)
        .populate('criadoPor', 'nome email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Machine.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: maquinas.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: maquinas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar máquinas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Buscar máquina por ID
// @route   GET /api/machines/:id
// @access  Private
exports.buscarMaquina = async (req, res) => {
  try {
    // Validar ObjectId
    if (!validarObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de máquina inválido'
      });
    }
    
    const maquina = await Machine.findById(req.params.id)
      .populate('criadoPor', 'nome email');
    
    if (!maquina) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: maquina
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar máquina',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Atualizar máquina
// @route   PUT /api/machines/:id
// @access  Private
exports.atualizarMaquina = async (req, res) => {
  try {
    // Validar ObjectId
    if (!validarObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de máquina inválido'
      });
    }
    
    // Não permitir atualizar criadoPor
    delete req.body.criadoPor;
    
    const maquina = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('criadoPor', 'nome email');
    
    if (!maquina) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Máquina atualizada com sucesso',
      data: maquina
    });
  } catch (error) {
    // Erro de duplicação
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Número de série já cadastrado'
      });
    }
    
    // Erro de validação
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
      message: 'Erro ao atualizar máquina',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deletar máquina
// @route   DELETE /api/machines/:id
// @access  Private/Admin
exports.deletarMaquina = async (req, res) => {
  try {
    // Validar ObjectId
    if (!validarObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de máquina inválido'
      });
    }
    
    const maquina = await Machine.findByIdAndDelete(req.params.id);
    
    if (!maquina) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Máquina deletada com sucesso',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar máquina',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obter estatísticas de máquinas
// @route   GET /api/machines/stats
// @access  Private
exports.obterEstatisticas = async (req, res) => {
  try {
    const stats = await Machine.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalMaquinas = await Machine.countDocuments();
    const manutencaoProxima = await Machine.countDocuments({
      proximaManutencao: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Próximos 7 dias
      }
    });
    
    const atrasadas = await Machine.countDocuments({
      proximaManutencao: { $lt: new Date() },
      status: { $ne: 'Em Manutenção' }
    });
    
    res.status(200).json({
      success: true,
      data: {
        total: totalMaquinas,
        porStatus: stats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        manutencaoProxima7Dias: manutencaoProxima,
        manutencaoAtrasada: atrasadas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};