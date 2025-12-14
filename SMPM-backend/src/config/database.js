const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    console.log('🔄 Tentando conectar ao MongoDB Atlas...');
    
    // Mongoose 8.x não precisa mais dessas opções
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📚 Database: ${conn.connection.name}`);
    
    // Event listeners para monitorar conexão
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro no MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('🔗 MongoDB conectado');
    });
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB Atlas:', error.message);
    
    // Mensagens de erro específicas
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('🔐 ERRO: Credenciais inválidas. Verifique:');
      console.error('   - Username correto no MongoDB Atlas');
      console.error('   - Password correto (sem caracteres especiais ou URL-encoded)');
      console.error('   - String de conexão no arquivo .env');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 ERRO: Não foi possível encontrar o servidor. Verifique:');
      console.error('   - Sua conexão com a internet');
      console.error('   - O endereço do cluster está correto');
      console.error('   - O cluster está ativo no MongoDB Atlas');
    } else if (error.message.includes('IP') || error.message.includes('not allowed')) {
      console.error('🚫 ERRO: IP não autorizado. Verifique:');
      console.error('   - Seu IP está na lista de IPs permitidos no Atlas');
      console.error('   - Adicione 0.0.0.0/0 para permitir todos os IPs (Network Access)');
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('⏱️  ERRO: Timeout na conexão. Verifique:');
      console.error('   - Sua conexão com a internet');
      console.error('   - Firewall não está bloqueando MongoDB');
    }
    
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 Conexão com MongoDB fechada devido ao término da aplicação');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fechar conexão:', error);
    process.exit(1);
  }
});

module.exports = connectDatabase;