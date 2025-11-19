import db from "../db.js";

// Função para garantir que a galeria seja sempre um array válido
const processGallery = (galleryData) => {
    if (!galleryData) return [];

    // Se vier como string do DB
    if (typeof galleryData === "string") {
        try {
            const parsed = JSON.parse(galleryData);
            return Array.isArray(parsed) ? parsed : [galleryData];
        } catch {
            return [galleryData];
        }
    }

    return Array.isArray(galleryData) ? galleryData : [];
};

// GET ÚNICO
export const getProdutoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            "SELECT id, nome, descricao, tags, galeria FROM produtos WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado." });
        }

        const produto = rows[0];
        produto.galeria = processGallery(produto.galeria);
        res.json({ produto });
    } catch (err) {
        console.error("Erro em getProdutoById:", err);
        res.status(500).json({ error: "Erro ao buscar produto por ID" });
    }
};

// GET TODOS
export const getProdutos = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, nome, descricao, tags, galeria FROM produtos"
        );

        const produtos = rows.map((r) => ({
            ...r,
            galeria: processGallery(r.galeria),
            category: r.tags?.trim() || "Outros"
        }));

        res.json({ produtos });
    } catch (err) {
        console.error("Erro em getProdutos:", err);
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
};

// GET TAGS
export const getTagsProdutos = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT DISTINCT tags FROM produtos");
        const tags = rows.map((r) => r.tags).filter(Boolean);
        res.json({ tags });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar tags" });
    }
};

// POST COM MULTIPLAS IMAGENS
export const createProduto = async (req, res) => {
    try {
        const { nome, descricao, tags } = req.body;

        // Salva URL DO CLOUDINARY
        const urlsGaleria = req.files?.map((file) => file.path || file.url || file.secure_url) || [];
        const galeriaJson = JSON.stringify(urlsGaleria);

        const [result] = await db.query(
            "INSERT INTO produtos (nome, descricao, tags, galeria) VALUES (?, ?, ?, ?)",
            [nome, descricao, tags, galeriaJson]
        );

        res.status(201).json({
            id: result.insertId,
            nome,
            descricao,
            tags,
            galeria: urlsGaleria
        });
    } catch (err) {
        console.error("Erro em createProduto:", err);
        res.status(500).json({ error: "Erro ao criar produto" });
    }
};

// PUT COM MULTIPLAS IMAGENS
export const updateProduto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, tags } = req.body;

        const novosUrlsGaleria = req.files?.map((file) => file.path || file.url || file.secure_url) || [];
        const novaGaleriaJson = novosUrlsGaleria.length > 0
            ? JSON.stringify(novosUrlsGaleria)
            : null;

        let query = "UPDATE produtos SET nome=?, descricao=?, tags=?";
        let values = [nome, descricao, tags];

        if (novaGaleriaJson) {
            query += ", galeria=?";
            values.push(novaGaleriaJson);
        }

        query += " WHERE id=?";
        values.push(id);

        await db.query(query, values);

        res.json({ id, nome, descricao, tags, galeria: novosUrlsGaleria });
    } catch (err) {
        console.error("Erro em updateProduto:", err);
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
};

// DELETE
export const deleteProduto = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM produtos WHERE id=?", [id]);
        res.json({ id });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar produto" });
    }
};
