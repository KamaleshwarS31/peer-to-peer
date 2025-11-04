// backend/routes/notesRoutes.js
const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// POST — Upload new note
router.post("/upload", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    await newNote.save();
    res.json({ message: "Note uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload note" });
  }
});

// GET — Fetch all notes
router.get("/all", async (req, res) => {
  try {
    const notes = await Note.find().sort({ uploadedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notes" });
  }
});

module.exports = router;
