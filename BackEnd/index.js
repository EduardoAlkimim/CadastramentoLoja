const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { storage } = require('./cloudinaryConfig');
const upload = multer({ storage });
const connectDB = require('./db'); // Importa a nova função de conexão
const Produto = require('./models/Produto'); // Importa o nosso Model
require('dotenv').config();

const app = express();

// Conecta ao banco de dados ao iniciar o servidor
connectDB();

app.use(cors());
app.use(express.json());

// Cadastrar produto - AGORA USANDO MONGOOSE
app.post('/produtos', upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
    }

    const { nome, preco, tags } = req.body;
    const imagem_url = req.file.path;

    // Em vez de 'INSERT INTO', usamos o método .create() do Model
    const novoProduto = await Produto.create({
      nome,
      preco,
      tags,
      imagem_url
    });

    res.status(201).json(novoProduto); // Retorna o produto criado pelo MongoDB

  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Listar produtos - AGORA USANDO MONGOOSE
app.get('/produtos', async (req, res) => {
  try {
    // Em vez de 'SELECT *', usamos o método .find()
    const produtos = await Produto.find();
    res.json(produtos);

  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

// Editar produto - AGORA USANDO MONGOOSE
app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, tags } = req.body;

    if (!nome || !preco || !tags) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    // Em vez de 'UPDATE', usamos .findByIdAndUpdate()
    // O { new: true } faz com que ele retorne o documento já atualizado.
    const produtoAtualizado = await Produto.findByIdAndUpdate(
      id,
      { nome, preco, tags },
      { new: true }
    );
    
    // Se o produto não for encontrado, retorna um erro
    if (!produtoAtualizado) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(produtoAtualizado);

  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    return res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

// Deletar produto - AGORA USANDO MONGOOSE
app.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Em vez de 'DELETE', usamos .findByIdAndDelete()
    const produtoDeletado = await Produto.findByIdAndDelete(id);

    // Se o produto não for encontrado para deletar
    if (!produtoDeletado) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto deletado com sucesso' });
    
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    return res.status(500).json({ erro: 'Erro ao deletar produto' });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});