require('dotenv').config();
const mysql = require('mysql2');
const url = require('url');

// Pega a URL do .env
const dbUrl = process.env.DATABASE_URL;

// Faz o parse da URL
const parsedUrl = new url.URL(dbUrl);

const connection = mysql.createConnection({
  host: parsedUrl.hostname,
  port: parsedUrl.port,
  user: parsedUrl.username,
  password: parsedUrl.password,
  database: parsedUrl.pathname.replace('/', '') // remove a barra inicial
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao MySQL no Railway!');
});

module.exports = connection;
