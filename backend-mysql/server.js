// Express.js-server

// require("dotenv").config();

import rateLimit from "express-rate-limit"; 
// for security - to limit the number of requests to the backend (e.g. to prevent brute-force attacks on login endpoint)

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}

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
// cors is additional protection against bots - it allows only requests from our frontend (CLIENT_URL) 
// and allows cookies to be sent in cross-origin requests (credentials: true), 
// it disables direct access to backend API from other origins (e.g. Postman, other websites etc.) 
// - only our frontend can access the backend API, and only with cookies (for authentication)
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/items", itemsRouter);
app.use("/api", authRouter);
app.use("/api/categories", categoriesRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
