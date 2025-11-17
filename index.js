const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { storage } = require('./cloudinaryConfig'); // Seu cloudinaryConfig.js (está perfeito, não mude)
const db = require('./db'); // Nosso novo db.js
require('dotenv').config();

const upload = multer({ storage });
const app = express();

app.use(cors());
app.use(express.json());

/* =======================================================
  Função helper para tratar tags
======================================================= */
const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') return tags.split(',').map(t => t.trim());
  return [];
};

/* =======================================================
  Cadastrar produto
======================================================= */
app.post('/produtos', upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
    }

    const { nome, descricao, tags } = req.body;
    if (!nome || !descricao || !tags) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const imagem_url = req.file.path; // .path é o URL do Cloudinary
    const tagsArray = parseTags(tags);

    const query = 'INSERT INTO produtos (nome, descricao, tags, imagem_url) VALUES (?, ?, ?, ?)';
    
    // Note o 'await' e o 'db.execute' (mais seguro que 'query')
    const [result] = await db.execute(query, [
      nome, 
      descricao, 
      JSON.stringify(tagsArray), // Salva como JSON
      imagem_url
    ]);

    res.status(201).json({
      id: result.insertId,
      nome,
      descricao,
      tags: tagsArray,
      imagem_url
    });

  } catch (err) {
    console.error('Erro ao processar /produtos:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

/* =======================================================
  Listar produtos (com paginação)
======================================================= */
app.get('/produtos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    // 1. Busca os produtos da página
    const query = 'SELECT * FROM produtos ORDER BY id DESC LIMIT ? OFFSET ?';
    const [results] = await db.query(query, [limit, offset]);

    // 2. Conta o total de produtos
    const [[countResult]] = await db.query('SELECT COUNT(*) AS total FROM produtos');
    const total = countResult.total;
    
    // Processa as tags
    const produtos = results.map(p => ({
      ...p,
      // O driver mysql2 já faz o parse do JSON automaticamente
      // Mas garantimos que seja um array para o front
      tags: Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : [])
    }));

    res.json({
      produtos,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

/* =======================================================
  Editar produto
======================================================= */
app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, tags } = req.body;

    if (!nome || !descricao || !tags) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const tagsArray = parseTags(tags);

    const query = 'UPDATE produtos SET nome = ?, descricao = ?, tags = ? WHERE id = ?';
    await db.execute(query, [
      nome, 
      descricao, 
      JSON.stringify(tagsArray), 
      id
    ]);

    // Busca o produto atualizado para retornar ao front
    const [[produto]] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
    
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({
      ...produto,
      tags: Array.isArray(produto.tags) ? produto.tags : []
    });

  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    return res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

/* =======================================================
  Deletar produto
======================================================= */
app.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.execute('DELETE FROM produtos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto deletado com sucesso' });

  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    return res.status(500).json({ erro: 'Erro ao deletar produto' });
  }
});

/* =======================================================
  Inicialização do servidor
======================================================= */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});