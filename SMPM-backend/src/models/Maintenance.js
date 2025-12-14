const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  maquina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Máquina é obrigatória']
  },
  tipo: {
    type: String,
    enum: ['Preventiva', 'Corretiva', 'Preditiva', 'Inspeção'],
    required: [true, 'Tipo de manutenção é obrigatório']
  },
  status: {
    type: String,
    enum: ['Pendente', 'Em Andamento', 'Concluída', 'Cancelada'],
    default: 'Pendente'
  },
  prioridade: {
    type: String,
    enum: ['Baixa', 'Média', 'Alta', 'Crítica'],
    default: 'Média'
  },
  dataAgendada: {
    type: Date,
    required: [true, 'Data agendada é obrigatória']
  },
  dataInicio: {
    type: Date
  },
  dataConclusao: {
    type: Date
  },
  duracao: {
    type: Number // Em horas
  },
  tecnicoResponsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxlength: 1000
  },
  pecasUtilizadas: [{
    nome: String,
    quantidade: Number,
    custo: Number
  }],
  custoTotal: {
    type: Number,
    default: 0
  },
  observacoes: {
    type: String,
    maxlength: 500
  },
  anexos: [{
    tipo: String, // 'foto', 'documento', 'relatório'
    url: String,
    nome: String
  }],
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Índices para melhorar performance
MaintenanceSchema.index({ maquina: 1, dataAgendada: -1 });
MaintenanceSchema.index({ status: 1 });
MaintenanceSchema.index({ tipo: 1 });

// Calcular duração automaticamente
MaintenanceSchema.pre('save', function(next) {
  if (this.dataInicio && this.dataConclusao) {
    const diff = this.dataConclusao - this.dataInicio;
    this.duracao = Math.round(diff / (1000 * 60 * 60)); // Converter para horas
  }
  next();
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);