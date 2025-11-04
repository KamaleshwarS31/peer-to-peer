const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    text: String,
    image: String,
    time: String,
    replyTo: String,
    user: String,
});

module.exports = mongoose.models.Chat || mongoose.model("Chat", chatSchema);