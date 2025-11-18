import express from "express";
import multer from "multer";
import { getItens, getTagsItens, createItem, updateItem, deleteItem } from "../controllers/itensAvulsosController.js";
import { storage } from "../cloudinaryConfig.js";

const router = express.Router();
const upload = multer({ storage });

router.get("/", getItens);
router.get("/tags", getTagsItens);
router.post("/", upload.single('imagem_url'), createItem);   // 🔥 nome certo aqui!
router.put("/:id", upload.single('imagem_url'), updateItem);
router.delete("/:id", deleteItem);

export default router;
