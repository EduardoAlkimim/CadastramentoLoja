import express from "express";
import multer from "multer";
import {
  getProdutos,
  getTagsProdutos,
  createProduto,
  updateProduto,
  deleteProduto
} from "../controllers/produtosController.js";
import { storage } from "../cloudinaryConfig.js";

const router = express.Router();
const upload = multer({ storage });

// ROTAS
router.get("/", getProdutos);
router.get("/tags", getTagsProdutos);

// POST com imagem
router.post("/", upload.single("imagem"), createProduto);

// PUT agora aceita imagem também!
router.put("/:id", upload.single("imagem"), updateProduto);

router.delete("/:id", deleteProduto);

export default router;
