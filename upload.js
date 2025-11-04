const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ["pdf", "ppt", "doc"],
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ "uploads" is the collection name
module.exports = mongoose.model("Upload", uploadSchema, "uploads");
