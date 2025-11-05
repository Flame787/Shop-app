// setting up the server-communication with the database in MySQL

const mysql = require("mysql2/promise");
require("dotenv").config();
console.log("DB_USER:", process.env.DB_USER); // just for testing .env variables

const config = {
  host: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// -> here we have created the server.

// now - create a connection pool to the database and export it as a promise:

const poolPromise = mysql.createPool(config);

module.exports = {
  sql: mysql,
  poolPromise,
};
