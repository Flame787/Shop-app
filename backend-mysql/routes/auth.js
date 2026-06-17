const express = require("express");
// const { poolPromise } = require("../db.js");
const { prisma } = require("../src/prisma.js");
 // using Prisma ORM instead of raw SQL queries

// import the authenticateToken middleware to protect certain routes and ensure that only authenticated users can access them:
const { authenticateToken } = require("../middleware/auth");
const bcrypt = require("bcrypt"); // for hashing passwords
const jwt = require("jsonwebtoken"); // for creating and verifying JWT tokens

const router = express.Router(); // create a new router object to define routes related to authentication and user management

const JWT_SECRET = process.env.JWT_SECRET; // secret key for signing JWT tokens, should be stored in environment variables for security reasons

// 8th API: LOGIN ROUTE - checks email & password that a user sends during login, and returns JWT-token + basic info (id, email, password-hash):
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // const pool = await poolPromise;
    // const [rows] = await pool.query(
    //   "SELECT customer_id, email, password_hash, role FROM customers WHERE email = ?",
    //   [email],
    // );

    // if (rows.length === 0) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid credentials",
    //   });
    // }

    // const user = rows[0];

    const user = await prisma.customer.findUnique({
      where: { email },
      select: {
        customer_id: true,
        email: true,
        password_hash: true,
        role: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

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
      sameSite: "none",
      path: "/",
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

// 9th API: SIGNUP ROUTE - creates a new user account
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password strength validation (at least 8 characters, one uppercase, one lowercase, one number)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    }

    // const pool = await poolPromise;

    // Check if user already exists
    // const [existingUser] = await pool.query(
    //   "SELECT customer_id FROM customers WHERE email = ?",
    //   [email],
    // );

    // if (existingUser.length > 0) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "User with this email already exists",
    //   });
    // }

    const existingUser = await prisma.customer.findUnique({
      where: { email },
      select: { customer_id: true },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    // const [result] = await pool.query(
    //   "INSERT INTO customers (email, password_hash, role, date_registered, name) VALUES (?, ?, 'user', NOW(), '')",
    //   [email, hashedPassword],
    // );

    // const userId = result.insertId;

    const newUser = await prisma.customer.create({
      data: {
        email,
        password_hash: hashedPassword,
        role: "user",
        date_registered: new Date(),
        name: "",
      },
    });

    // Generate tokens
    // const accessToken = jwt.sign(
    //   {
    //     sub: userId,
    //     role: 'user',
    //   },
    //   JWT_SECRET,
    //   { expiresIn: "15m" },
    // );

    const accessToken = jwt.sign(
      { sub: newUser.customer_id, role: "user" },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    // const refreshToken = jwt.sign(
    //   { sub: userId, role: 'user' },
    //   JWT_SECRET,
    //   { expiresIn: "7d" },
    // );

    const refreshToken = jwt.sign(
      { sub: newUser.customer_id, role: "user" },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // res.status(201).json({
    //   success: true,
    //   accessToken,
    //   user: {
    //     id: userId,
    //     email: email,
    //     role: 'user',
    //   },
    // });

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: newUser.customer_id,
        email: newUser.email,
        role: "user",
      },
    });

    // } catch (error) {
    //   console.error("Signup error:", error);
    //   console.error("Signup error message:", error.message);
    //   console.error("Signup error stack:", error.stack);
    //   res.status(500).json({
    //     success: false,
    //     message: `Server error: ${error.message}`,
    //   });
    // }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
});

// 10th API: GET - return info about currently logged-in user:
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;

    // const pool = await poolPromise;
    // const [rows] = await pool.query(
    //   "SELECT customer_id, name, email, role, date_registered, phone, street, city, postal_code, country FROM customers WHERE customer_id = ?",
    //   [userId],
    // );
    // // added all fields to the SELECT query, to show all user data on the Account page (when user is logged in)

    // if (rows.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }

    // const user = rows[0];

    const user = await prisma.customer.findUnique({
      where: { customer_id: userId },
      select: {
        customer_id: true,
        name: true,
        email: true,
        role: true,
        date_registered: true,
        phone: true,
        street: true,
        city: true,
        postal_code: true,
        country: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

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

    const { name, email, phone, street, city, postal_code, country, password } =
      req.body;

    // const pool = await poolPromise;

    const updateData = {
      name,
      email,
      phone,
      street,
      city,
      postal_code,
      country,
    };

    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    // Update user with Prisma
    await prisma.customer.update({
      where: { customer_id: userId },
      data: updateData,
    });

    const updatedUser = await prisma.customer.findUnique({
      where: { customer_id: userId },
      select: {
        customer_id: true,
        name: true,
        email: true,
        role: true,
        date_registered: true,
        phone: true,
        street: true,
        city: true,
        postal_code: true,
        country: true,
      },
    });

    res.status(200).json({ success: true, data: updatedUser });
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

    // const pool = await poolPromise;

    // const [existing] = await pool.query(
    //   "SELECT customer_id FROM customers WHERE email = ?",
    //   [email],
    // );
    // if (existing.length > 0) {
    //   return res
    //     .status(409)
    //     .json({ success: false, message: "Email already exists" });
    // }

    const existing = await prisma.customer.findUnique({
      where: { email },
      select: { customer_id: true },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // const [result] = await pool.query(
    //   "INSERT INTO customers (name, email, password_hash, role, date_registered) VALUES (?, ?, ?, ?, NOW())",
    //   [name, email, password_hash, role || "user"],
    // );

    // res.status(201).json({
    //   success: true,
    //   message: "User registered",
    //   userId: result.insertId,
    // });

    const newUser = await prisma.customer.create({
      data: {
        name,
        email,
        password_hash,
        role: role || "user",
        date_registered: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered",
      userId: newUser.customer_id,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 13th API: POST - return new ACCESS-TOKEN, if REFRESH-TOKEN is valid:
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

// 14th API: Cart API: GET saved cart for the logged-in user
router.get("/cart", authenticateToken, (req, res) => {
  try {
    const cartCookie = req.cookies.cart;
    const cartData = cartCookie ? JSON.parse(cartCookie) : null;

    const currentUserId = String(req.user.sub);

    if (!cartData || String(cartData.userId) !== currentUserId) {
      if (cartData && String(cartData.userId) !== currentUserId) {
        res.clearCookie("cart", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          path: "/",
        });
      }
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    res
      .status(200)
      .json({ success: true, cart: { items: cartData.items || [] } });
  } catch (error) {
    console.error("Error reading cart cookie:", error);
    res.status(500).json({ success: false, message: "Unable to read cart" });
  }
});

// 15th API: Cart API: SAVE cart for the logged-in user in httpOnly cookie
router.post("/cart", authenticateToken, (req, res) => {
  try {
    const { items } = req.body;
    const cart = {
      userId: String(req.user.sub),
      items: Array.isArray(items) ? items : [],
    };

    res.cookie("cart", JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error saving cart cookie:", error);
    res.status(500).json({ success: false, message: "Unable to save cart" });
  }
});

// 16th API: Cart API: clear stored cart for the logged-in user
router.delete("/cart", authenticateToken, (req, res) => {
  res.clearCookie("cart", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({ success: true, message: "Cart cleared" });
});

// 17th API: POST - LOGOUT - clears the refreshToken httpOnly cookie:
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
