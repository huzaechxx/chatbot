const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("chatbot", ChatSchema);

module.exports = Chat;
