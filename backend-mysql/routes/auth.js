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
      "SELECT customer_id, name, email, role, date_registered, phone, street, city, postal_code, country FROM customers WHERE customer_id = ?",
      [userId],
    );
    // added all fields to the SELECT query, to show all user data on the Account page (when user is logged in)

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

// 11th API: PUT - update currently logged-in user's profile information
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    const {
      name,
      email,
      phone,
      street,
      city,
      postal_code,
      country,
      password,
    } = req.body;

    const pool = await poolPromise;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE customers SET name = ?, email = ?, phone = ?, street = ?, city = ?, postal_code = ?, country = ?, password_hash = ? WHERE customer_id = ?",
        [name, email, phone, street, city, postal_code, country, hashedPassword, userId],
      );
    } else {
      await pool.query(
        "UPDATE customers SET name = ?, email = ?, phone = ?, street = ?, city = ?, postal_code = ?, country = ? WHERE customer_id = ?",
        [name, email, phone, street, city, postal_code, country, userId],
      );
    }
    // we update all fields that user can edit on the Account page (name, email, phone, street, city, postal_code, country, password)

    const [rows] = await pool.query(
      "SELECT customer_id, name, email, role, date_registered, phone, street, city, postal_code, country FROM customers WHERE customer_id = ?",
      [userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error in PUT /api/me:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// 12th API: POST - REGISTER NEW USER + hashing password:
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

// 13th API: POST - LOGOUT - clears the refreshToken httpOnly cookie:
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;