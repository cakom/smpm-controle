const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter no mínimo 3 caracteres'],
    maxlength: [50, 'Nome deve ter no máximo 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, forneça um email válido'
    ]
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    select: false // Não retorna senha por padrão
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'tecnico', 'operador'],
      message: '{VALUE} não é uma role válida'
    },
    default: 'operador'
  },
  ativo: {
    type: Boolean,
    default: true
  },
  ultimoAcesso: {
    type: Date
  }
}, {
  timestamps: true
});

// Índices para melhorar performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  // Só fazer hash se a senha foi modificada
  if (!this.isModified('senha')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senha
UserSchema.methods.compararSenha = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

// Método para atualizar último acesso
UserSchema.methods.atualizarUltimoAcesso = async function() {
  this.ultimoAcesso = new Date();
  await this.save();
};

// Remover senha antes de converter para JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);