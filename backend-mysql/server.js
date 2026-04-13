// Express.js-server

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const itemsRouter = require("./routes/items");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");

const app = express();
app.use(bodyParser.json());  
// this is needed to parse JSON bodies in requests, but now not needed, because we use express.json() instead of bodyParser.json() - express has built-in body parsing since version 4.16.0
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/items", itemsRouter);
app.use("/api", authRouter);
app.use("/api/categories", categoriesRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
