const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  maquina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Máquina é obrigatória']
  },
  tipo: {
    type: String,
    enum: {
      values: ['Preventiva', 'Corretiva', 'Preditiva', 'Inspeção'],
      message: '{VALUE} não é um tipo válido de manutenção'
    },
    required: [true, 'Tipo de manutenção é obrigatório']
  },
  status: {
    type: String,
    enum: {
      values: ['Pendente', 'Em Andamento', 'Concluída', 'Cancelada'],
      message: '{VALUE} não é um status válido'
    },
    default: 'Pendente'
  },
  prioridade: {
    type: String,
    enum: {
      values: ['Baixa', 'Média', 'Alta', 'Crítica'],
      message: '{VALUE} não é uma prioridade válida'
    },
    default: 'Média'
  },
  dataAgendada: {
    type: Date,
    required: [true, 'Data agendada é obrigatória']
  },
  dataInicio: {
    type: Date,
    validate: {
      validator: function(value) {
        // dataInicio não pode ser antes de dataAgendada
        return !value || !this.dataAgendada || value >= this.dataAgendada;
      },
      message: 'Data de início não pode ser antes da data agendada'
    }
  },
  dataConclusao: {
    type: Date,
    validate: {
      validator: function(value) {
        // dataConclusao não pode ser antes de dataInicio
        return !value || !this.dataInicio || value >= this.dataInicio;
      },
      message: 'Data de conclusão não pode ser antes da data de início'
    }
  },
  duracao: {
    type: Number, // Em horas
    min: [0, 'Duração não pode ser negativa']
  },
  tecnicoResponsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    minlength: [10, 'Descrição deve ter no mínimo 10 caracteres'],
    maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres']
  },
  pecasUtilizadas: [{
    nome: {
      type: String,
      required: true,
      trim: true
    },
    quantidade: {
      type: Number,
      required: true,
      min: [0, 'Quantidade não pode ser negativa']
    },
    custo: {
      type: Number,
      required: true,
      min: [0, 'Custo não pode ser negativo']
    }
  }],
  custoTotal: {
    type: Number,
    default: 0,
    min: [0, 'Custo total não pode ser negativo']
  },
  observacoes: {
    type: String,
    maxlength: [500, 'Observações devem ter no máximo 500 caracteres']
  },
  anexos: [{
    tipo: {
      type: String,
      enum: ['foto', 'documento', 'relatório', 'outro']
    },
    url: String,
    nome: String
  }],
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices para melhorar performance
MaintenanceSchema.index({ maquina: 1, dataAgendada: -1 });
MaintenanceSchema.index({ status: 1 });
MaintenanceSchema.index({ tipo: 1 });
MaintenanceSchema.index({ prioridade: 1 });
MaintenanceSchema.index({ tecnicoResponsavel: 1 });
MaintenanceSchema.index({ dataAgendada: 1 });

// Virtual para verificar se está atrasada
MaintenanceSchema.virtual('atrasada').get(function() {
  if (this.status === 'Concluída' || this.status === 'Cancelada') return false;
  return this.dataAgendada < new Date();
});

// Virtual para dias de atraso
MaintenanceSchema.virtual('diasAtraso').get(function() {
  if (!this.atrasada) return 0;
  const diff = new Date() - this.dataAgendada;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Garantir que virtuals sejam incluídos no JSON
MaintenanceSchema.set('toJSON', { virtuals: true });
MaintenanceSchema.set('toObject', { virtuals: true });

// Hook: Calcular duração automaticamente
MaintenanceSchema.pre('save', function(next) {
  // Calcular duração se dataInicio e dataConclusao existirem
  if (this.dataInicio && this.dataConclusao) {
    const diff = this.dataConclusao - this.dataInicio;
    this.duracao = Math.round(diff / (1000 * 60 * 60)); // Converter para horas
  }
  
  // Calcular custo total baseado nas peças
  if (this.pecasUtilizadas && this.pecasUtilizadas.length > 0) {
    this.custoTotal = this.pecasUtilizadas.reduce((total, peca) => {
      return total + (peca.quantidade * peca.custo);
    }, 0);
  }
  
  next();
});

// Hook: Validar que status seja adequado às datas
MaintenanceSchema.pre('save', function(next) {
  if (this.status === 'Concluída' && !this.dataConclusao) {
    return next(new Error('Manutenção concluída deve ter data de conclusão'));
  }
  
  if (this.status === 'Em Andamento' && !this.dataInicio) {
    return next(new Error('Manutenção em andamento deve ter data de início'));
  }
  
  next();
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);