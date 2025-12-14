require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./src/config/database');
const { swaggerUi, specs, swaggerOptions } = require('./swagger');

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const machineRoutes = require('./src/routes/machineRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Conectar ao banco de dados
connectDatabase();

// Middlewares
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: '🚀 SMPM API - Sistema de Manutenção Preventiva de Máquinas',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      documentation: '/api-docs',
      auth: '/api/auth',
      machines: '/api/machines',
      maintenances: '/api/maintenances'
    },
    desenvolvedor: 'Gabriela - SENAI Roberto Mange',
    tecnologias: ['Node.js', 'Express', 'MongoDB Atlas', 'JWT']
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/maintenances', maintenanceRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.path} não encontrada`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api-docs',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/machines',
      'POST /api/machines',
      'GET /api/maintenances',
      'POST /api/maintenances',
      'GET /api/maintenances/kpis'
    ]
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  
  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors
    });
  }
  
  // Erro de cast (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido fornecido'
    });
  }
  
  // Erro de duplicação (unique)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} já está em uso`
    });
  }
  
  // Erro JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 SMPM BACKEND SERVER RUNNING                   ║
║                                                    ║
║   📡 Port: ${PORT.toString().padEnd(42)}║
║   🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(34)}║
║   🗄️  Database: MongoDB Atlas                      ║
║                                                    ║
║   📚 API Docs:                                     ║
║      http://localhost:${PORT}/api-docs             ${PORT.toString().length === 4 ? ' ' : ''}║
║                                                    ║
║   🔗 Endpoints:                                    ║
║      http://localhost:${PORT}/api/auth             ${PORT.toString().length === 4 ? ' ' : ''}║
║      http://localhost:${PORT}/api/machines         ${PORT.toString().length === 4 ? ' ' : ''}║
║      http://localhost:${PORT}/api/maintenances     ${PORT.toString().length === 4 ? ' ' : ''}║
║                                                    ║
║   👨‍💻 Desenvolvido por: Gabriela                   ║
║   🏫 SENAI Roberto Mange - ADS 2º Semestre         ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;