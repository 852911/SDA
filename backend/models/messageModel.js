const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, refPath: "toModel", required: true },
  toModel: { type: String, enum: ["Student", "StudyGroup"], required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
