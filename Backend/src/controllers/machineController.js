const Machine = require('../models/Machine');

// @desc    Criar nova máquina
// @route   POST /api/machines
// @access  Private
exports.criarMaquina = async (req, res) => {
  try {
    req.body.criadoPor = req.usuario.id;
    const maquina = await Machine.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Máquina criada com sucesso',
      data: maquina
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar máquina',
      error: error.message
    });
  }
};

// @desc    Listar todas as máquinas
// @route   GET /api/machines
// @access  Private
exports.listarMaquinas = async (req, res) => {
  try {
    const { status, setor, tipo, search } = req.query;
    let query = {};
    
    // Filtros
    if (status) query.status = status;
    if (setor) query.setor = setor;
    if (tipo) query.tipo = tipo;
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { modelo: { $regex: search, $options: 'i' } }
      ];
    }
    
    const maquinas = await Machine.find(query)
      .populate('criadoPor', 'nome email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: maquinas.length,
      data: maquinas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar máquinas',
      error: error.message
    });
  }
};

// @desc    Buscar máquina por ID
// @route   GET /api/machines/:id
// @access  Private
exports.buscarMaquina = async (req, res) => {
  try {
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
      error: error.message
    });
  }
};

// @desc    Atualizar máquina
// @route   PUT /api/machines/:id
// @access  Private
exports.atualizarMaquina = async (req, res) => {
  try {
    const maquina = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar máquina',
      error: error.message
    });
  }
};

// @desc    Deletar máquina
// @route   DELETE /api/machines/:id
// @access  Private/Admin
exports.deletarMaquina = async (req, res) => {
  try {
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
      error: error.message
    });
  }
};