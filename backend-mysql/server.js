// Express.js-server
// defining APIs and methods

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { sql, poolPromise } = require("./db.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
// fallback "super-secret-key", later added real secret-key in .env

const JWT_SECRET = process.env.JWT_SECRET;

const PORT = process.env.PORT || 5000;
// we can define another real PORT for production (https... where we host backend), but for development - it will use http://localhost:5000/

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Middleware for checking JWT-token:

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // dodajemo payload u req.user
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// Middleware: check if custoemr has some specific role:
const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

// -------------------- Creating APIs ----------------------------//

// 1st API: GET - Get all items from the base:

app.get("/api/items", async (req, res) => {
  try {
    const { sort } = req.query;
    let sql = "SELECT * FROM items";

    // sorting items depending on selected criteria in sort-dropdown:
    switch (sort) {
      case "a-z":
        sql += " ORDER BY name ASC";
        break;
      case "z-a":
        sql += " ORDER BY name DESC";
        break;
      case "price-asc":
        sql += " ORDER BY price ASC";
        break;
      case "price-desc":
        sql += " ORDER BY price DESC";
        break;
      case "newest":
        sql += " ORDER BY item_id DESC"; // ordering from last added items (higher item_id) to older items (smaller item_id)
        break;
      case "bestseller":
        sql += " ORDER BY sold_count DESC";
        break;
      default:
        sql += " ORDER BY item_id ASC"; // default sorting
    }

    const pool = await poolPromise;
    // const [rows] = await pool.query("SELECT * FROM items");
    const [rows] = await pool.query(sql);

    console.log(rows);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

/* test 1st API: http://localhost:5000/api/items - should return this if connecting, but table is empty (no items):
  {
    "success": true,
    "data": []
  }

  test sorting in the 1st API:

  http://localhost:5000/api/items?sort=a-z - OK
  http://localhost:5000/api/items?sort=price-desc - OK
  http://localhost:5000/api/items?sort=newest - OK
  http://localhost:5000/api/items?sort=bestseller - "Server error, try again", "error": "Unknown column 'sold_count' in 'order clause'"

*/

// 2nd API: GET - get a single item by ID:

app.get("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // pulls ID from the req.params / URL-parameters (e.g. /api/items/8 -> id = 8)
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const pool = await poolPromise;
    const [rows] = await pool.query("SELECT * FROM items WHERE item_id = ?", [
      id, //   [id]  - if already destructured from req.params, OR full path:  [req.params.id]
    ]);
    if (rows.length === 0) {
      // if no such item with this ID was found in the base
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    console.log(rows[0]); // will write full product-object (based on selected ID) in backend console

    res.status(200).json({
      success: true,
      data: rows[0], // shows 1st (and only) fetched row about the item with this ID
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

/* test 2nd API: http://localhost:5000/api/items/2 - should return the item with ID 2
 
*/

// 3rd API: POST - add a new item into the database - ADMIN:

app.post(
  "/api/items",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        discount_price,
        quantity_in_stock,
        picture_url,
        category_id,
        tags,
        is_active,
      } = req.body;

      // validation of input data, before creating new item:

      // required fields are name and price, other data is not mandatory (for now -> will be changed later):
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: "Name and price are required.",
        });
      }

      const pool = await poolPromise;

      const [result] = await pool.query(
        `INSERT INTO items (name,
      description,
      price,
      discount_price,
      quantity_in_stock,
      picture_url,
      category_id,
      tags,
      is_active) VALUES(?,?,?,?,?,?,?,?,?)`,
        [
          name,
          description || null, // for each field that is not required, we allow that it can be null (add: || null)
          price,
          discount_price || null,
          quantity_in_stock ?? 0,
          picture_url || null,
          category_id || null,
          tags || null,
          is_active || null,
        ],
      );

      res.status(201).json({
        success: true,
        message: "Item created successfully.",
        data: {
          item_id: result.insertId,
          // result - object with metadata about executed request, insertId - ID that the base creates for every new row with AUTO_INCREMENT
          name,
          description,
          price,
          discount_price,
          quantity_in_stock,
          picture_url,
          category_id,
          tags,
          is_active,
        },
      });
    } catch (error) {
      console.error("Error adding new item:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
);

// 4th API: PUT - update an existing item - ADMIN:

app.put(
  "/api/items/:id",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params; // ID of an item, which data we want to update

      const {
        name,
        description,
        price,
        discount_price,
        quantity_in_stock,
        picture_url,
        category_id,
        tags,
        is_active,
      } = req.body; // sending updated data (about one item with specific ID) in req.body

      // validation of input data (if some of requested data is missing):
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: "Item name and price are required.",
        });
      }

      const pool = await poolPromise;

      const [result] = await pool.query(
        "UPDATE items SET name = ?, description = ?, price = ?, discount_price = ?, quantity_in_stock = ?, picture_url = ?, category_id = ?, tags = ?, is_active = ? WHERE item_id = ?",
        [
          name,
          description || null,
          price,
          discount_price || null,
          quantity_in_stock ?? 0,
          picture_url || null,
          category_id || null,
          tags || null,
          is_active || null,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Item updated successfully.",
        updatedId: id,
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
);

// 5th API: DELETE - remove an item by ID - ADMIN:

app.delete(
  "/api/items/:id",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      //  const id = parseInt(req.params.id, 10);    // would be additional validation, if incoming ID is string - should be parse to number

      // validation:
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID",
        });
      }

      const pool = await poolPromise;

      const [result] = await pool.query("DELETE FROM items WHERE item_id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      res.status(200).json({
        success: true,
        message: `Item with id ${id} deleted from the base.`,
        deletedId: id,
      });
    } catch (error) {
      console.log("Error deleting item:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
);

// 6th API: GET - get items by category ID
app.get("/api/items/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { sort } = req.query;

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    let sql = "SELECT * FROM items WHERE category_id = ?";

    switch (sort) {
      case "a-z":
        sql += " ORDER BY name ASC";
        break;
      case "z-a":
        sql += " ORDER BY name DESC";
        break;
      case "price-asc":
        sql += " ORDER BY price ASC";
        break;
      case "price-desc":
        sql += " ORDER BY price DESC";
        break;
      case "newest":
        sql += " ORDER BY item_id DESC";
        break;
      case "bestseller":
        sql += " ORDER BY sold_count DESC";
        break;
      default:
        sql += " ORDER BY item_id ASC";
    }

    const pool = await poolPromise;
    // const [rows] = await pool.query(
    //   "SELECT * FROM items WHERE category_id = ?",
    //   [categoryId]
    // );
    const [rows] = await pool.query(sql, [categoryId]);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching items by category:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

/* test 6th API: http://localhost:5000/api/items/category/1 or http://localhost:5000/api/items/category/5 
- should return list of items as 'data' [] - inside are objects {} - one object {} for each item, with attributes and values (name, price...)
{
"success": true,
"data": [ {}, {}, {}, {}, {} ...]
}
*/

// 7th API: GET - get all categories names (for category buttons)
app.get("/api/categories", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(
      "SELECT category_id, category_name FROM categories",
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

// 8th API: GET - get items (filter) by searchWord:
app.get("/api/search/items", async (req, res) => {
  try {
    console.log("req.query:", req.query);

    // pulling searchWord from the query-parameters in the URL:
    // const rawQuery = req.query.query || "";
    // const searchWord = rawQuery.trim().toLowerCase();

    const { query, sort } = req.query;
    const searchWord = (query || "").trim().toLowerCase();

    // If empty string - throw error 400 right away:
    if (!searchWord) {
      // if empty string, returns 400
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    // Allow only letters (a–z, including diacritics)
    // \p{L} = any letter in Unicode
    const onlyLetters = /^[\p{L}]+$/u;
    if (!onlyLetters.test(searchWord)) {
      return res.status(400).json({
        success: false,
        message: "Search query must contain only letters.",
      });
    }

    let sql = `
      SELECT * FROM items
      WHERE LOWER(name) REGEXP ?
         OR LOWER(description) REGEXP ?
         OR LOWER(tags) REGEXP ?
    `;

    // added ORDER BY depending on sort-criteria:
    switch (sort) {
      case "a-z":
        sql += " ORDER BY name ASC";
        break;
      case "z-a":
        sql += " ORDER BY name DESC";
        break;
      case "price-asc":
        sql += " ORDER BY price ASC";
        break;
      case "price-desc":
        sql += " ORDER BY price DESC";
        break;
      case "newest":
        sql += " ORDER BY item_id DESC"; // ili date_added ako imaš kolonu
        break;
      case "bestseller":
        sql += " ORDER BY sold_count DESC"; // pazi da kolona postoji!
        break;
      default:
        sql += " ORDER BY item_id ASC";
    }

    // If validation has passed:
    const pool = await poolPromise;

    // function escapeRegex(word) {
    //   return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // }
    // // . becomes literal dot, + becomes plus sign, * becomes asterisk etc, and not sql-regex special characters

    // const safeWord = escapeRegex(searchWord.toLowerCase());

    const [rows] = await pool.query(
      sql,

      //   const [rows] = await pool.query(
      //     `SELECT * FROM items
      //  WHERE LOWER(name) REGEXP ?
      //     OR LOWER(description) REGEXP ?
      //     OR LOWER(tags) REGEXP ?`,

      // [
      //   "\\b" + searchWord.toLowerCase() + "\\b",
      //   "\\b" + searchWord.toLowerCase() + "\\b",
      //   "\\b" + searchWord.toLowerCase() + "\\b",
      // ]

      [`\\b${searchWord}\\b`, `\\b${searchWord}\\b`, `\\b${searchWord}\\b`],
    );
    // REGEXP-query - finds only whole words that match searchWord in name, description or tag

    res.status(200).json({
      success: true,
      data: rows,
    });
    console.log("Search route hit:", req.query);
  } catch (error) {
    console.error("Error searching items:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

/* test: http://localhost:5000/api/items/search?query=chair */

// 9th API: LOGIN ROUTE - checks email & password that a user sends during login, and returns JWT-token + basic info (id, email, password-hash):

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check that both fields (email, password) were sent:
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // fetch user from database:
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

    // Check password:
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate JWT-token:
    const accessToken = jwt.sign(
      {
        sub: user.customer_id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "15m" }, // access-token lasts for 15 min
    );

    // generate refresh-token:
    const refreshToken = jwt.sign(
      { sub: user.customer_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }, // refresh-token lasts  for 7 days
    );

    // save refresh-token to httpOnly-cookie (not visible on browser, safe against XSS-attacks):
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // *secure: true - works only via HTTPS-connection
      secure: process.env.NODE_ENV === "production", // *on localhost we don't have HTTPS, so we don't set "secure: true"
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    // return token + basic info about user (customer_id, email, role):
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

// // 10th API: GET - return info about currently logged-in user, requires JWT-token (received via 9th API), sends token in header:
app.get("/api/me", authenticateToken, async (req, res) => {
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
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const pool = await poolPromise;

    // check if there is email:
    const [existing] = await pool.query(
      "SELECT customer_id FROM customers WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    // hashing password:
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
app.post("/api/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    // check refresh-token:
    const payload = jwt.verify(refreshToken, JWT_SECRET);

    // create new access-token:
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

/*** later add ADMIN - GET route for Admin-UI-pages:

app.get("/api/admin/dashboard", authenticateToken, requireRole("admin"), (req, res) => {

});
 
*/
