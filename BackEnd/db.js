require('dotenv').config();
const mongoose = require('mongoose');

// Pega a URL de conexão do MongoDB do seu arquivo .env
const mongoURI = process.env.MONGO_URI;

// Função para conectar ao banco de dados
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // Essas opções não são mais necessárias nas versões recentes do Mongoose, mas não atrapalham.
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB Atlas!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    // Encerra o processo com falha
    process.exit(1);
  }
};

// Exportamos a função de conexão para ser chamada no arquivo principal
module.exports = connectDB;