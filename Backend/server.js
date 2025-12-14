require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./src/config/database');
const { swaggerUi, specs } = require('./swagger');

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const machineRoutes = require('./src/routes/machineRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Conectar ao banco de dados
connectDatabase();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: '🚀 SMPM API está rodando!',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/maintenances', maintenanceRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   🚀 SMPM Backend Server Running                 ║
║   📡 Port: ${PORT}                               ║
║   🌍 Environment: ${process.env.NODE_ENV}        ║
║   📚 API Docs: http://localhost:${PORT}/api-docs ║
╚══════════════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.log('❌ Erro não tratado:', err);
  process.exit(1);
});