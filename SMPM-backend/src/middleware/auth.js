const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Middleware de autenticação
exports.proteger = async (req, res, next) => {
  try {
    let token;
    
    // Verificar se o token existe no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado. Token não fornecido.'
      });
    }
    
    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validar se o ID é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({
        success: false,
        message: 'Token contém ID inválido'
      });
    }
    
    // Buscar usuário
    const usuario = await User.findById(decoded.id).select('-senha');
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou foi deletado'
      });
    }
    
    // Anexar usuário à requisição
    req.usuario = usuario;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Faça login novamente'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Erro na autenticação',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware de autorização por role
exports.autorizar = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }
    
    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado. Usuário com role '${req.usuario.role}' não tem permissão para esta ação`,
        requiredRoles: roles
      });
    }
    next();
  };
};