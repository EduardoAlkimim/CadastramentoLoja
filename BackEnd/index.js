const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { storage } = require('./cloudinaryConfig');
const upload = multer({ storage });
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Cadastrar produto
app.post('/produtos', upload.single('imagem'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
    }

    const { nome, preco, tags } = req.body;
    const imagem_url = req.file.path;

    const query = 'INSERT INTO produtos (nome, preco, tags, imagem_url) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, preco, tags, imagem_url], (err, result) => {
      if (err) {
        console.error('Erro ao inserir produto:', err);
        return res.status(500).json({ erro: 'Erro ao cadastrar produto' });
      }

      res.status(201).json({
        id: result.insertId,
        nome,
        preco,
        tags,
        imagem_url
      });
    });
  } catch (err) {
    console.error('Erro ao processar /produtos:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Listar produtos
app.get('/produtos', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
    res.json(results);
  });
});

// Editar produto
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco, tags } = req.body;

  if (!nome || !preco || !tags) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  const query = 'UPDATE produtos SET nome = ?, preco = ?, tags = ? WHERE id = ?';
  db.query(query, [nome, preco, tags, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar produto:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }

    const selectQuery = 'SELECT * FROM produtos WHERE id = ?';
    db.query(selectQuery, [id], (err2, rows) => {
      if (err2) {
        console.error('Erro ao buscar produto atualizado:', err2);
        return res.status(500).json({ erro: 'Erro ao buscar produto atualizado' });
      }
      res.json(rows[0]);
    });
  });
});

// Deletar produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM produtos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar produto:', err);
      return res.status(500).json({ erro: 'Erro ao deletar produto' });
    }
    res.json({ mensagem: 'Produto deletado com sucesso' });
  });
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
