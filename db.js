import dotenv from "dotenv";
import mysql from "mysql2/promise";
import url from "url";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL não encontrada no .env");
}

const parsedUrl = new url.URL(dbUrl);

const pool = mysql.createPool({
  host: parsedUrl.hostname,
  port: parsedUrl.port || 4000,
  user: parsedUrl.username,
  password: parsedUrl.password,
  database: parsedUrl.pathname.replace("/", ""),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

console.log("Pool de conexões com TiDB criado.");

// **AGORA EXPORT DISSO AQUI**
export default pool;
