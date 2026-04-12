const express = require("express");
const { poolPromise } = require("../db.js");
const { authenticateToken } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// 9th API: LOGIN ROUTE - checks email & password that a user sends during login, and returns JWT-token + basic info (id, email, password-hash):
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const pool = await poolPromise;
    const [rows] = await pool.query(
      "SELECT customer_id, email, password_hash, role FROM customers WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        sub: user.customer_id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { sub: user.customer_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.customer_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// 10th API: GET - return info about currently logged-in user:
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;

    const pool = await poolPromise;
    const [rows] = await pool.query(
      "SELECT customer_id, name, email, role, date_registered FROM customers WHERE customer_id = ?",
      [userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in /api/me:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// 11th API: POST - REGISTER NEW USER + hashing password:
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const pool = await poolPromise;

    const [existing] = await pool.query(
      "SELECT customer_id FROM customers WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO customers (name, email, password_hash, role, date_registered) VALUES (?, ?, ?, ?, NOW())",
      [name, email, password_hash, role || "user"],
    );

    res.status(201).json({
      success: true,
      message: "User registered",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 12th API: POST - return new ACCESS-TOKEN, if REFRESH-TOKEN is valid:
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    const payload = jwt.verify(refreshToken, JWT_SECRET);

    const accessToken = jwt.sign(
      { sub: payload.sub, role: payload.role },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
});

module.exports = router;