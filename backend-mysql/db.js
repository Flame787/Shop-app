// ***This file is not used anymore, because we use Prisma as an ORM to connect to the MySQL database, 
// but it is left here for learning purposes, to see how to set up a connection pool with mysql2/promise, without using an ORM.
// We are now using src/prisma.js file instead, to set up the connection to the database with Prisma ORM.***

// // setting up the server-communication with the database in MySQL

// const mysql = require("mysql2/promise");

// // require("dotenv").config();
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config({ path: ".env.local" });
// }

// console.log("DB_USER:", process.env.DB_USER); // just for testing .env variables

// const config = {
//   host: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// };

// // -> here we have created the server.

// // now - create a connection pool to the database and export it as a promise:

// const poolPromise = mysql.createPool(config);

// module.exports = {
//   sql: mysql,
//   poolPromise,
// };
