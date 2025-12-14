const Maintenance = require('../models/Maintenance');
const Machine = require('../models/Machine');
const mongoose = require('mongoose');

// Validar ObjectId
const validarObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// @desc    Criar nova manutenção
// @route   POST /api/maintenances
// @access  Private
exports.criarManutencao = async (req, res) => {
  try {
    req.body.criadoPor = req.usuario.id;
    
    // Validar ObjectId da máquina
    if (!validarObjectId(req.body.maquina)) {
      return res.status(400).json({
        success: false,
        message: 'ID de máquina inválido'
      });
    }
    
    // Verificar se máquina existe
    const maquina = await Machine.findById(req.body.maquina);
    if (!maquina) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      });
    }
    
    // Validar técnico se fornecido
    if (req.body.tecnicoResponsavel && !validarObjectId(req.body.tecnicoResponsavel)) {
      return res.status(400).json({
        success: false,
        message: 'ID de técnico inválido'
      });
    }
    
    const manutencao = await Maintenance.create(req.body);
    
    // Popular referências
    await manutencao.populate([
      { path: 'maquina', select: 'nome tipo setor' },
      { path: 'tecnicoResponsavel', select: 'nome email' },
      { path: 'criadoPor', select: 'nome email' }
    ]);
    
    // Atualizar última manutenção da máquina se status for concluída
    if (req.body.status === 'Concluída') {
      await Machine.findByIdAndUpdate(req.body.maquina, {
        ultimaManutencao: req.body.dataConclusao || new Date(),
        status: 'Ativa'
      });
    } else if (req.body.status === 'Em Andamento') {
      await Machine.findByIdAndUpdate(req.body.maquina, {
        status: 'Em Manutenção'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Manutenção criada com sucesso',
      data: manutencao
    });
  } catch (error) {
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
      message: 'Erro ao criar manutenção',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Listar todas as manutenções
// @route   GET /api/maintenances
// @access  Private
exports.listarManutencoes = async (req, res) => {
  try {
    const { maquina, status, tipo, prioridade, dataInicio, dataFim, page = 1, limit = 10 } = req.query;
    let query = {};
    
    // Filtros
    if (maquina) {
      if (!validarObjectId(maquina)) {
        return res.status(400).json({
          success: false,
          message: 'ID de máquina inválido'
        });
      }
      query.maquina = maquina;
    }
    
    if (status) query.status = status;
    if (tipo) query.tipo = tipo;
    if (prioridade) query.prioridade = prioridade;
    
    if (dataInicio && dataFim) {
      query.dataAgendada = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim)
      };
    } else if (dataInicio) {
      query.dataAgendada = { $gte: new Date(dataInicio) };
    } else if (dataFim) {
      query.dataAgendada = { $lte: new Date(dataFim) };
    }
    
    // Paginação
    const skip = (page - 1) * limit;
    
    const [manutencoes, total] = await Promise.all([
      Maintenance.find(query)
        .populate('maquina', 'nome tipo setor status')
        .populate('tecnicoResponsavel', 'nome email')
        .populate('criadoPor', 'nome email')
        .sort({ dataAgendada: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Maintenance.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: manutencoes.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: manutencoes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar manutenções',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Buscar manutenção por ID
// @route   GET /api/maintenances/:id
// @access  Private
exports.buscarManutencao = async (req, res) => {
  try {
    // Validar ObjectId
    if (!validarObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de manutenção inválido'
      });
    }
    
    const manutencao = await Maintenance.findById(req.params.id)
      .populate('maquina')
      .populate('tecnicoResponsavel', 'nome email')
      .populate('criadoPor', 'nome email');
    
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: manutencao
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar manutenção',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Atualizar manutenção
// @route   PUT /api/maintenances/:id
// @access  Private
exports.atualizarManutencao = async (req, res) => {
  try {
    // Validar ObjectId
    if (!validarObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de manutenção inválido'
      });
    }
    
    // Não permitir atualizar criadoPor
    delete req.body.criadoPor;
    
    // Validar técnico se fornecido
    if (req.body.tecnicoResponsavel && !validarObjectId(req.body.tecnicoResponsavel)) {
      return res.status(400).json({
        success: false,
        message: 'ID de técnico inválido'
      });
    }
    
    const manutencao = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'maquina' },
      { path: 'tecnicoResponsavel', select: 'nome email' },
      { path: 'criadoPor', select: 'nome email' }
    ]);
    
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      });
    }
    
    // Atualizar status da máquina baseado no status da manutenção
    if (manutencao.maquina) {
      if (req.body.status === 'Concluída') {
        await Machine.findByIdAndUpdate(manutencao.maquina._id, {
          ultimaManutencao: manutencao.dataConclusao || new Date(),
          status: 'Ativa'
        });
      } else if (req.body.status === 'Em Andamento') {
        await Machine.findByIdAndUpdate(manutencao.maquina._id, {
          status: 'Em Manutenção'
        });
      } else if (req.body.status === 'Cancelada') {
        await Machine.findByIdAndUpdate(manutencao.maquina._id, {
          status: 'Ativa'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Manutenção atualizada com sucesso',
      data: manutencao
    });
  } catch (error) {
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
      message: 'Erro ao atualizar manutenção',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deletar manutenção
// @route   DELETE /api/maintenances/:id
// @access  Private/Admin
exports.deletarManutencao = async (req, res) => {
  try {
    // Validar ObjectId
    if (!validarObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de manutenção inválido'
      });
    }
    
    const manutencao = await Maintenance.findByIdAndDelete(req.params.id);
    
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Manutenção deletada com sucesso',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar manutenção',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Buscar histórico de manutenções por máquina
// @route   GET /api/maintenances/machine/:machineId
// @access  Private
exports.historicoMaquina = async (req, res) => {
  try {
    // Validar ObjectId
    if (!validarObjectId(req.params.machineId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de máquina inválido'
      });
    }
    
    const manutencoes = await Maintenance.find({ maquina: req.params.machineId })
      .populate('tecnicoResponsavel', 'nome email')
      .populate('criadoPor', 'nome email')
      .sort({ dataAgendada: -1 });
    
    res.status(200).json({
      success: true,
      count: manutencoes.length,
      data: manutencoes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obter KPIs de manutenção
// @route   GET /api/maintenances/kpis
// @access  Private
exports.obterKPIs = async (req, res) => {
  try {
    const [
      totalManutencoes,
      pendentes,
      emAndamento,
      concluidas,
      canceladas,
      atrasadas,
      proximos7dias,
      custoResult
    ] = await Promise.all([
      Maintenance.countDocuments(),
      Maintenance.countDocuments({ status: 'Pendente' }),
      Maintenance.countDocuments({ status: 'Em Andamento' }),
      Maintenance.countDocuments({ status: 'Concluída' }),
      Maintenance.countDocuments({ status: 'Cancelada' }),
      Maintenance.countDocuments({
        status: { $in: ['Pendente', 'Em Andamento'] },
        dataAgendada: { $lt: new Date() }
      }),
      Maintenance.countDocuments({
        status: 'Pendente',
        dataAgendada: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }),
      Maintenance.aggregate([
        { $match: { status: 'Concluída' } },
        { $group: { _id: null, total: { $sum: '$custoTotal' } } }
      ])
    ]);
    
    // KPIs por tipo
    const porTipo = await Maintenance.aggregate([
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // KPIs por prioridade
    const porPrioridade = await Maintenance.aggregate([
      {
        $group: {
          _id: '$prioridade',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totais: {
          total: totalManutencoes,
          pendentes,
          emAndamento,
          concluidas,
          canceladas,
          atrasadas,
          proximos7dias
        },
        porTipo: porTipo.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        porPrioridade: porPrioridade.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        financeiro: {
          custoTotal: custoResult[0]?.total || 0,
          custoPorManutencao: concluidas > 0 ? (custoResult[0]?.total || 0) / concluidas : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter KPIs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};