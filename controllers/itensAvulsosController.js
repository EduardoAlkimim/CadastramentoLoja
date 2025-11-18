import db from "../db.js";

// POST criar item avulso
export const createItem = async (req, res) => {
  try {
    const { nome, descricao, tags } = req.body;
    const imagem_url = req.file?.path || null;

    if (!imagem_url) {
      return res.status(400).json({ error: "A imagem é obrigatória!" });
    }

    const tagsString = Array.isArray(tags) ? tags.join(",") : tags;

    const sql = `
      INSERT INTO itens_avulsos (nome, descricao, tags, imagem_url)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [nome, descricao, tagsString, imagem_url]);

    res.status(201).json({ message: "Item criado com sucesso!", id: result.insertId });
  } catch (error) {
    console.error("Erro ao criar item avulso:", error);
    res.status(500).json({ error: "Erro ao criar item" });
  }
};

// PUT atualizar item avulso
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, tags } = req.body;

    const novaImagemUrl = req.file ? req.file.path : null;
    const tagStr = typeof tags === 'string' && tags.trim() !== '' ? tags.trim() : null;

    let query = "UPDATE itens_avulsos SET nome=?, descricao=?, tags=?";
    let values = [nome, descricao, tagStr];

    if (novaImagemUrl) {
      query += ", imagem_url=?";
      values.push(novaImagemUrl);
    }

    query += " WHERE id=?";
    values.push(id);

    await db.query(query, values);

    res.json({
      id,
      nome,
      descricao,
      categoria: tagStr || 'Outros',
      imagem_url: novaImagemUrl || 'URL_ANTIGA_NAO_BUSCADA'
    });
  } catch (err) {
    console.error("Erro ao atualizar item avulso:", err);
    res.status(500).json({ error: "Erro ao atualizar item avulso" });
  }
};

// GET todos os itens avulsos
export const getItens = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nome, descricao, tags, imagem_url FROM itens_avulsos");

    const itens = rows.map(r => ({
      ...r,
      categoria: r.tags && typeof r.tags === 'string' && r.tags.trim() !== '' ? r.tags.trim() : 'Outros',
      imagem_url: r.imagem_url || null
    }));

    res.json({ itens });
  } catch (err) {
    console.error("Erro em getItens:", err);
    res.status(500).json({ error: "Erro ao buscar itens avulsos" });
  }
};

// GET tags de itens avulsos
export const getTagsItens = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT tags FROM itens_avulsos");
    const tags = rows.map(r => r.tags).filter(Boolean);
    res.json({ tags });
  } catch (err) {
    console.error("Erro ao buscar tags:", err);
    res.status(500).json({ error: "Erro ao buscar tags." });
  }
};

// DELETE item avulso
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM itens_avulsos WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item avulso não encontrado." });
    }

    res.json({ id: id, message: "Item avulso deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar item avulso:", err);
    res.status(500).json({ error: "Erro ao deletar item avulso." });
  }
};
