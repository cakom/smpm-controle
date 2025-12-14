const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    
    // Buscar usuário
    req.usuario = await User.findById(decoded.id);
    
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};

// Middleware de autorização por role
exports.autorizar = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({
        success: false,
        message: `Usuário com role '${req.usuario.role}' não tem permissão para acessar esta rota`
      });
    }
    next();
  };
};