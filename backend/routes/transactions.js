const express = require("express");
const db = require("../db");
const router = express.Router();

// GET transaction history (newest first)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.id, t.type, t.quantity, t.created_at,
              b.title AS book_title, u.name AS user_name
       FROM transactions t
       JOIN books b ON t.book_id = b.id
       JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC, t.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST record a transaction (add stock or deduct stock)
router.post("/", async (req, res) => {
  const { book_id, user_id, type, quantity } = req.body;
  const amount = Number(quantity);

  if (!book_id || !user_id || (type !== "add" && type !== "deduct")) {
    return res.status(400).json({ error: "Book, user and a valid type are required" });
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({ error: "Quantity must be a whole number above 0" });
  }

  try {
    const [books] = await db.query("SELECT * FROM books WHERE id = ?", [book_id]);
    if (books.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = books[0];
    if (type === "deduct" && amount > book.quantity) {
      return res.status(400).json({ error: "Not enough copies in stock" });
    }

    // update the stock
    if (type === "add") {
      await db.query("UPDATE books SET quantity = quantity + ? WHERE id = ?", [amount, book_id]);
    } else {
      await db.query("UPDATE books SET quantity = quantity - ? WHERE id = ?", [amount, book_id]);
    }

    // save the transaction record
    await db.query(
      "INSERT INTO transactions (book_id, user_id, type, quantity) VALUES (?, ?, ?, ?)",
      [book_id, user_id, type, amount]
    );

    res.status(201).json({ message: "Transaction recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
