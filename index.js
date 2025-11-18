import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import produtosRoutes from "./routes/produtosRoutes.js";
import itensAvulsosRoutes from "./routes/itensAvulsosRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/produtos", produtosRoutes);
app.use("/itens-avulsos", itensAvulsosRoutes);

app.get("/", (req, res) => {
  res.send("API rodando!");
});

app.use((err, req, res, next) => {
  console.error("ERRO GLOBAL:", err);
  res.status(500).json({ error: "Erro interno no servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
