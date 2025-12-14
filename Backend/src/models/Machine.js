const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da máquina é obrigatório'],
    trim: true
  },
  tipo: {
    type: String,
    required: [true, 'Tipo da máquina é obrigatório'],
    enum: ['Torno', 'Fresadora', 'Prensa', 'Impressora', 'Empilhadeira', 'Outro']
  },
  setor: {
    type: String,
    required: [true, 'Setor é obrigatório'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Ativa', 'Inativa', 'Em Manutenção', 'Aguardando Peças'],
    default: 'Ativa'
  },
  fabricante: {
    type: String,
    trim: true
  },
  modelo: {
    type: String,
    trim: true
  },
  numeroSerie: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  dataAquisicao: {
    type: Date
  },
  ultimaManutencao: {
    type: Date
  },
  proximaManutencao: {
    type: Date,
    required: [true, 'Data da próxima manutenção é obrigatória']
  },
  frequenciaManutencao: {
    type: Number, // Em dias
    default: 30
  },
  observacoes: {
    type: String,
    maxlength: 500
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Índice para melhorar performance em buscas
MachineSchema.index({ nome: 1, setor: 1 });
MachineSchema.index({ status: 1 });
MachineSchema.index({ proximaManutencao: 1 });

module.exports = mongoose.model('Machine', MachineSchema);