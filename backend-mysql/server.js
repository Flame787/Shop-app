// Express.js-server
// defining APIs and methods

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { sql, poolPromise } = require("./db.js");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
// we can define another real PORT for production (https... where we host backend), but for development - it will use http://localhost:5000/

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// -------------------- Creating APIs ----------------------------//

// 1st API: GET - Get all items from the base:

app.get("/api/items", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query("SELECT * FROM items");
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

    console.log(rows[0]);

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

/* test 1st API: http://localhost:5000/api/items/2 - should return the item with ID 2
 
*/

// 3rd API: POST - add a new item into the database:

app.post("/api/items", async (req, res) => {
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
      ]
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
});

// 4th API: PUT - update an existing item

app.put("/api/items/:id", async (req, res) => {
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
      ]
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
});

// 5th API: DELETE - remove an item by ID

app.delete("/api/items/:id", async (req, res) => {
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
});

// 6th API: GET - get items by category ID
app.get("/api/items/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const pool = await poolPromise;
    const [rows] = await pool.query(
      "SELECT * FROM items WHERE category_id = ?",
      [categoryId]
    );

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