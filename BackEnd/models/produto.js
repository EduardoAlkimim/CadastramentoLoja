const mongoose = require('mongoose');

// Este é o Schema. É a estrutura do seu documento no MongoDB.
// Note que não precisamos de um 'id', o MongoDB cria um '_id' automaticamente.
const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  tags: {
    type: String
  },
  imagem_url: {
    type: String,
    required: true
  },
  // Adiciona data de criação automaticamente
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criamos o "Model" a partir do Schema. É através dele que vamos interagir com a collection 'produtos'.
const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;