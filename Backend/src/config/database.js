const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📚 Database: ${conn.connection.name}`);
    
    // Event listeners para monitorar conexão
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro no MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB Atlas:', error.message);
    
    // Mensagens de erro específicas
    if (error.message.includes('bad auth')) {
      console.error('🔐 ERRO: Credenciais inválidas. Verifique username e password no .env');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 ERRO: Não foi possível encontrar o servidor. Verifique a URL de conexão');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️ ERRO: Timeout. Verifique sua conexão com a internet');
    }
    
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 Conexão com MongoDB fechada devido ao término da aplicação');
  process.exit(0);
});

module.exports = connectDatabase;