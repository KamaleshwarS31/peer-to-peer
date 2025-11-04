// backend/models/File.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  course: String,
  topic: String,
  filename: String,
  type: String,
  path: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});
// const fileSchema = new mongoose.Schema({
//   filename: String,
//   fileUrl: String,
//   uploadedBy: String,
//   description: String,
//   uploadDate: { type: Date, default: Date.now }
// });

module.exports = mongoose.models.File || mongoose.model("File", fileSchema, "files");
