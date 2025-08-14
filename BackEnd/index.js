const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { storage } = require('./cloudinaryConfig');
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/produtos', upload.single('imagem'), async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.FILE:', req.file);

    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
    }

    const { nome, preco, tags } = req.body;
    const imagem_url = req.file.path;

    //  inserir no banco
    res.status(201).json({
      nome,
      preco,
      tags,
      imagem_url
    });

  } catch (err) {
    console.error('Erro ao processar /produtos:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.listen(3001, () => {
  console.log(' Servidor rodando na porta 3001');
});
