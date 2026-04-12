const express = require("express");
const { poolPromise } = require("../db.js");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// 1st API: GET - Get ALL items from the base:
router.get("/", async (req, res) => {
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

// 2nd API: GET - get a single item by ID:
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const pool = await poolPromise;
    const [rows] = await pool.query("SELECT * FROM items WHERE item_id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    console.log(rows[0]);

    res.status(200).json({
      success: true,
      data: rows[0],
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

// 3rd API: POST - ADD a NEW ITEM into the database - only ADMIN-role can add new items:
router.post(
  "/",
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
          description || null,
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

// 4th API: PUT - UPDATE an EXISTING ITEM - only ADMIN-role can update items:
router.put(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

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

// 5th API: DELETE - REMOVE an ITEM by ID - only ADMIN-role can delete items:
router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
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
router.get("/category/:categoryId", async (req, res) => {
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

// 8th API: GET - get items (filter) by searchWord:
router.get("/search/items", async (req, res) => {
  try {
    console.log("req.query:", req.query);

    const { query, sort } = req.query;
    const searchWord = (query || "").trim().toLowerCase();

    if (!searchWord) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

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

    const [rows] = await pool.query(
      sql,
      [`\\b${searchWord}\\b`, `\\b${searchWord}\\b`, `\\b${searchWord}\\b`],
    );

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

module.exports = router;