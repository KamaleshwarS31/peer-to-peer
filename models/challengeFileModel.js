const mongoose = require("mongoose");

const challengeFileSchema = new mongoose.Schema({
  filename: String,             // original filename
  path: String,                 // relative file path
  mimetype: String,             // pdf/image/etc.
  size: Number,                 // in bytes
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChallengeFile", challengeFileSchema);
