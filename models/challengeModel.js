const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  user: String,
  answerFile: String,
  pinned: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
});

const challengeSchema = new mongoose.Schema({
  creator: String,
  title: String,
  course: String,
  topic: String,
  difficulty: String,
  deadline: String,
  desc: String,
  challengeFileId: {type: mongoose.Schema.Types.ObjectId, ref: "ChallengeFile"}, // stores file path
  createdAt: Date,
  answers: [answerSchema],
});

module.exports = mongoose.model("Challenge", challengeSchema);;
