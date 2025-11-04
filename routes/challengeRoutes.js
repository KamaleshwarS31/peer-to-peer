const express = require("express");
const router = express.Router();
const multer = require("multer");
const Challenge = require("../models/challengeModel.js");
const ChallengeFile = require("../models/challengeFileModel.js");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/challenges/"); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create new challenge
router.post("/create", upload.single("questionFile"), async (req, res) => {
  try {
    const { creator, title, course, topic, difficulty, deadline, desc } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileDoc = new ChallengeFile({
        filename: req.file.filename,
        path: `/uploads/challenges/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedBy: creator,
    });

    await fileDoc.save();
    
    const challenge = new Challenge({
        creator,
        title,
        course,
        topic,
        difficulty,
        deadline,
        desc,
        challengeFileId: fileDoc._id,
        createdAt: new Date(),
    });

    await challenge.save();
    res.status(201).json({ message: "Challenge created successfully", challenge, file: fileDoc });
  } catch (err) {
    console.error("Error uploading challenge", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find()
    .populate("challengeFileId")
    .sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

module.exports = router;
