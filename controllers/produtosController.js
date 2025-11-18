import db from "../db.js";

export const getProdutos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produtos");
    res.json({ produtos: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
};

export const getTagsProdutos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT tags FROM produtos");
    const tags = rows.map((r) => r.tags).filter(Boolean);
    res.json({ tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar tags" });
  }
};

// 🔥 POST criar produto
export const createProduto = async (req, res) => {
  try {
    const { nome, descricao, tags } = req.body;
    const imagem_url = req.file?.path || null; // Cloudinary já manda o URL

    const [result] = await db.query(
      "INSERT INTO produtos (nome, descricao, tags, imagem_url) VALUES (?, ?, ?, ?)",
      [nome, descricao, tags, imagem_url]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      descricao,
      tags,
      imagem_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

// 🔥 PUT atualizar produto COM IMAGEM
export const updateProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, tags } = req.body;
    const imagem_url = req.file?.path || null;

    // Se mandou nova imagem, atualiza ela também
    if (imagem_url) {
      await db.query(
        "UPDATE produtos SET nome=?, descricao=?, tags=?, imagem_url=? WHERE id=?",
        [nome, descricao, tags, imagem_url, id]
      );
    } else {
      await db.query(
        "UPDATE produtos SET nome=?, descricao=?, tags=? WHERE id=?",
        [nome, descricao, tags, id]
      );
    }

    res.json({ id, nome, descricao, tags, imagem_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

export const deleteProduto = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM produtos WHERE id=?", [id]);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
};
