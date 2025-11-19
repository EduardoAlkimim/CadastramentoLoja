import express from "express";
import multer from "multer";
import {
  getProdutos,
  getTagsProdutos,
  createProduto,
  updateProduto,
  deleteProduto,
  getProdutoById
} from "../controllers/produtosController.js";
import { storage } from "../cloudinaryConfig.js";

const router = express.Router();
const upload = multer({ storage });

// ROTAS
router.get("/", getProdutos);
router.get("/tags", getTagsProdutos);
router.get("/:id", getProdutoById);

// POST e PUT aceitam múltiplas imagens no campo 'galeria'
router.post("/", upload.array("galeria", 5), createProduto);
router.put("/:id", upload.array("galeria", 5), updateProduto);

router.delete("/:id", deleteProduto);

export default router;
