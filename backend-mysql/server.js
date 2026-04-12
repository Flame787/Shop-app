// Express.js-server

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { poolPromise } = require("./db.js");

const itemsRouter = require("./routes/items");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/items", itemsRouter);
app.use("/api", authRouter);
app.use("/api/categories", categoriesRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
