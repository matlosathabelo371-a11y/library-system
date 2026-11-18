const express = require("express");
const db = require("../db");
const router = express.Router();

// POST login (name + membership ID)
router.post("/login", async (req, res) => {
  const { name, membership_id } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE name = ? AND membership_id = ?",
      [name, membership_id]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Wrong name or membership ID" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a user
router.post("/", async (req, res) => {
  const { name, membership_id, role } = req.body;
  if (!name || !membership_id || !role) {
    return res.status(400).json({ error: "Name, membership ID and role are required" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO users (name, membership_id, role) VALUES (?, ?, ?)",
      [name, membership_id, role]
    );
    res.status(201).json({ id: result.insertId, message: "User added" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "This membership ID is already used" });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT update a user
router.put("/:id", async (req, res) => {
  const { name, membership_id, role } = req.body;
  try {
    await db.query(
      "UPDATE users SET name = ?, membership_id = ?, role = ? WHERE id = ?",
      [name, membership_id, role, req.params.id]
    );
    res.json({ message: "User updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "This membership ID is already used" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
