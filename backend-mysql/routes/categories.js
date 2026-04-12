const express = require("express");
const { poolPromise } = require("../db.js");

const router = express.Router();

// 7th API: GET - get all categories names (for category buttons)
router.get("/", async (req, res) => {
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

module.exports = router;