const mongoose =  require("mongoose");

const answerSchema = new monogoose.Schema({
    user: String,
    answerFile: String,
    pinned: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Answer", answerSchema);