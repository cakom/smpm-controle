const Maintenance = require('../models/Maintenance');
const Machine = require('../models/Machine');

// @desc    Criar nova manutenção
// @route   POST /api/maintenances
// @access  Private
exports.criarManutencao = async (req, res) => {
  try {
    req.body.criadoPor = req.usuario.id;
    
    // Verificar se máquina existe
    const maquina = await Machine.findById(req.body.maquina);
    if (!maquina) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      });
    }
    
    const manutencao = await Maintenance.create(req.body);
    
    // Atualizar última manutenção da máquina se status for concluída
    if (req.body.status === 'Concluída') {
      await Machine.findByIdAndUpdate(req.body.maquina, {
        ultimaManutencao: req.body.dataConclusao || new Date()
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Manutenção criada com sucesso',
      data: manutencao
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar manutenção',
      error: error.message
    });
  }
};

// @desc    Listar todas as manutenções
// @route   GET /api/maintenances
// @access  Private
exports.listarManutencoes = async (req, res) => {
  try {
    const { maquina, status, tipo, dataInicio, dataFim } = req.query;
    let query = {};
    
    // Filtros
    if (maquina) query.maquina = maquina;
    if (status) query.status = status;
    if (tipo) query.tipo = tipo;
    if (dataInicio && dataFim) {
      query.dataAgendada = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim)
      };
    }
    
    const manutencoes = await Maintenance.find(query)
      .populate('maquina', 'nome tipo setor')
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
      message: 'Erro ao listar manutenções',
      error: error.message
    });
  }
};

// @desc    Buscar manutenção por ID
// @route   GET /api/maintenances/:id
// @access  Private
exports.buscarManutencao = async (req, res) => {
  try {
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
      error: error.message
    });
  }
};

// @desc    Atualizar manutenção
// @route   PUT /api/maintenances/:id
// @access  Private
exports.atualizarManutencao = async (req, res) => {
  try {
    const manutencao = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('maquina');
    
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      });
    }
    
    // Atualizar última manutenção da máquina se status mudou para concluída
    if (req.body.status === 'Concluída' && manutencao.maquina) {
      await Machine.findByIdAndUpdate(manutencao.maquina._id, {
        ultimaManutencao: manutencao.dataConclusao || new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Manutenção atualizada com sucesso',
      data: manutencao
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar manutenção',
      error: error.message
    });
  }
};

// @desc    Deletar manutenção
// @route   DELETE /api/maintenances/:id
// @access  Private/Admin
exports.deletarManutencao = async (req, res) => {
  try {
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
      error: error.message
    });
  }
};

// @desc    Buscar histórico de manutenções por máquina
// @route   GET /api/maintenances/machine/:machineId
// @access  Private
exports.historicoMaquina = async (req, res) => {
  try {
    const manutencoes = await Maintenance.find({ maquina: req.params.machineId })
      .populate('tecnicoResponsavel', 'nome email')
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
      error: error.message
    });
  }
};

// @desc    Obter KPIs de manutenção
// @route   GET /api/maintenances/kpis
// @access  Private
exports.obterKPIs = async (req, res) => {
  try {
    const totalManutencoes = await Maintenance.countDocuments();
    const pendentes = await Maintenance.countDocuments({ status: 'Pendente' });
    const emAndamento = await Maintenance.countDocuments({ status: 'Em Andamento' });
    const concluidas = await Maintenance.countDocuments({ status: 'Concluída' });
    
    // Manutenções atrasadas
    const atrasadas = await Maintenance.countDocuments({
      status: { $in: ['Pendente', 'Em Andamento'] },
      dataAgendada: { $lt: new Date() }
    });
    
    // Próximas 7 dias
    const proximos7dias = await Maintenance.countDocuments({
      status: 'Pendente',
      dataAgendada: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    // Custos
    const custoTotal = await Maintenance.aggregate([
      { $match: { status: 'Concluída' } },
      { $group: { _id: null, total: { $sum: '$custoTotal' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total: totalManutencoes,
        pendentes,
        emAndamento,
        concluidas,
        atrasadas,
        proximos7dias,
        custoTotal: custoTotal[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter KPIs',
      error: error.message
    });
  }
};