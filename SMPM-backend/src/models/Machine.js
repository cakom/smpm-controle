const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da máquina é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter no mínimo 3 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  tipo: {
    type: String,
    required: [true, 'Tipo da máquina é obrigatório'],
    enum: {
      values: ['Torno', 'Fresadora', 'Prensa', 'Impressora', 'Empilhadeira', 'Outro'],
      message: '{VALUE} não é um tipo válido de máquina'
    }
  },
  setor: {
    type: String,
    required: [true, 'Setor é obrigatório'],
    trim: true,
    minlength: [2, 'Setor deve ter no mínimo 2 caracteres']
  },
  status: {
    type: String,
    enum: {
      values: ['Ativa', 'Inativa', 'Em Manutenção', 'Aguardando Peças'],
      message: '{VALUE} não é um status válido'
    },
    default: 'Ativa'
  },
  fabricante: {
    type: String,
    trim: true,
    maxlength: [100, 'Fabricante deve ter no máximo 100 caracteres']
  },
  modelo: {
    type: String,
    trim: true,
    maxlength: [100, 'Modelo deve ter no máximo 100 caracteres']
  },
  numeroSerie: {
    type: String,
    unique: true,
    sparse: true, // Permite múltiplos documentos sem numeroSerie
    trim: true,
    maxlength: [50, 'Número de série deve ter no máximo 50 caracteres']
  },
  dataAquisicao: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value <= new Date();
      },
      message: 'Data de aquisição não pode ser no futuro'
    }
  },
  ultimaManutencao: {
    type: Date
  },
  proximaManutencao: {
    type: Date,
    required: [true, 'Data da próxima manutenção é obrigatória'],
    validate: {
      validator: function(value) {
        // Próxima manutenção deve ser no futuro ou hoje
        return value >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'Próxima manutenção deve ser hoje ou no futuro'
    }
  },
  frequenciaManutencao: {
    type: Number, // Em dias
    default: 30,
    min: [1, 'Frequência deve ser no mínimo 1 dia'],
    max: [365, 'Frequência deve ser no máximo 365 dias']
  },
  observacoes: {
    type: String,
    maxlength: [500, 'Observações devem ter no máximo 500 caracteres']
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices para melhorar performance em buscas
// (numeroSerie já tem índice automático devido ao unique: true + sparse: true)
MachineSchema.index({ nome: 1, setor: 1 });
MachineSchema.index({ status: 1 });
MachineSchema.index({ proximaManutencao: 1 });
MachineSchema.index({ tipo: 1 });

// Virtual para verificar se manutenção está atrasada
MachineSchema.virtual('manutencaoAtrasada').get(function() {
  if (!this.proximaManutencao) return false;
  return this.proximaManutencao < new Date() && this.status !== 'Em Manutenção';
});

// Virtual para dias até próxima manutenção
MachineSchema.virtual('diasProximaManutencao').get(function() {
  if (!this.proximaManutencao) return null;
  const diff = this.proximaManutencao - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Garantir que virtuals sejam incluídos no JSON
MachineSchema.set('toJSON', { virtuals: true });
MachineSchema.set('toObject', { virtuals: true });

// Hook para atualizar próxima manutenção quando ultimaManutencao é atualizada
MachineSchema.pre('save', function(next) {
  // Se ultimaManutencao foi atualizada, calcular próxima manutenção
  if (this.isModified('ultimaManutencao') && this.ultimaManutencao && this.frequenciaManutencao) {
    const proxima = new Date(this.ultimaManutencao);
    proxima.setDate(proxima.getDate() + this.frequenciaManutencao);
    this.proximaManutencao = proxima;
  }
  next();
});

module.exports = mongoose.model('Machine', MachineSchema);