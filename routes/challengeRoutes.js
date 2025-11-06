const express = require("express");
const router = express.Router();
const multer = require("multer");
const Challenge = require("../models/challengeModel.js");
const Answer = require("../models/answerModel.js");
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

// Storage for answer files
const answerStorage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, "uploads/answers/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.orginalname);
  },
});

const uploadAnswer = multer({ storage: answerStorage });
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

router.post("/:id/answers", uploadAnswer.single("answerFile"), async (req, res) => {
  try {
    const challengeId = req.params.id;
    const { user } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Challenge not found" });

    // Calculate score based on how early the user answers
    const now = new Date();
    const diffMin = (now - challenge.createdAt) / 60000;
    let score = 5;
    if (diffMin < 5) score = 50;
    else if (diffMin < 10) score = 30;
    else if (diffMin < 20) score = 10;

    const newAnswer = {
      user,
      answerFile: `/uploads/answers/${file.filename}`,
      pinned: false,
      score,
    };

    challenge.answers.push(newAnswer);
    await challenge.save();

    res.status(200).json({ message: "Answer uploaded successfully", aswer: newAnswer });
  } catch (err) {
    console.error("Error uploading answer:", err);
    res.status(500).json({ error: "Error uploading answer" });
  }
});

router.put("/:challengeId/answers/:answerIndex/pin", async (req, ans) => {
  try {
    const { challengeId, answerIndex } = req.params;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    challenge.answers.forEach((a, i) => (a.pinned = i === parseInt(answerIndex)));
    await challenge.save();

    res.json({ message: "Answer pinned successfully", answers: challenge.answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error pinning answr" });
  }
});

module.exports = router;
