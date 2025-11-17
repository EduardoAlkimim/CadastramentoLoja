require('dotenv').config();
const mysql = require('mysql2/promise'); // Importa a versão com Promises
const url = require('url');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL não encontrada no .env");
}

const parsedUrl = new url.URL(dbUrl);

const pool = mysql.createPool({
  host: parsedUrl.hostname,
  port: parsedUrl.port || 4000, // Porta padrão do TiDB
  user: parsedUrl.username,
  password: parsedUrl.password,
  database: parsedUrl.pathname.replace('/', ''),
  
  // --- A MÁGICA ESTÁ AQUI ---
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // --- ISSO É OBRIGATÓRIO PARA O TIDB ---
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

console.log('Pool de conexões com TiDB criado.');

// Exporta o pool, não uma conexão única
module.exports = pool;