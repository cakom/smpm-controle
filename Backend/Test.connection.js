// Teste de conexão com MongoDB Atlas
require('dotenv').config();
const mongoose = require('mongoose');

async function testarConexao() {
  try {
    console.log('🔄 Tentando conectar ao MongoDB Atlas...');
    console.log(`📡 URI: ${process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')}`); // Oculta senha
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout de 5 segundos
    });
    
    console.log('✅ Conexão com MongoDB Atlas estabelecida com sucesso!');
    console.log(`🏢 Database: ${mongoose.connection.name}`);
    
    // Verificar versão do MongoDB
    const admin = mongoose.connection.db.admin();
    const info = await admin.serverInfo();
    console.log(`📊 Versão do MongoDB: ${info.version}`);
    
    // Listar collections existentes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📦 Collections no banco: ${collections.length}`);
    if (collections.length > 0) {
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    await mongoose.connection.close();
    console.log('🔌 Conexão fechada com sucesso');
    console.log('\n✅ TUDO FUNCIONANDO PERFEITAMENTE!\n');
    
  } catch (error) {
    console.error('\n❌ ERRO ao conectar ao MongoDB Atlas:\n');
    
    if (error.message.includes('bad auth')) {
      console.error('🔐 Credenciais inválidas. Verifique:');
      console.error('   - Username correto no MongoDB Atlas');
      console.error('   - Password correto (senha gerada ou definida)');
      console.error('   - String de conexão no arquivo .env');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Erro de DNS/Rede. Verifique:');
      console.error('   - Sua conexão com a internet');
      console.error('   - O endereço do cluster está correto');
    } else if (error.message.includes('IP')) {
      console.error('🚫 Erro de IP. Verifique:');
      console.error('   - Seu IP está na lista de IPs permitidos no Atlas');
      console.error('   - Adicione 0.0.0.0/0 para permitir todos os IPs');
    } else {
      console.error('Mensagem do erro:', error.message);
    }
    
    process.exit(1);
  }
}

testarConexao();