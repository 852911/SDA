const mongoose = require("mongoose");

const StudyGroupSchema = new mongoose.Schema({
  founder: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  name: { type: String, required: true },
  subj: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]
});

module.exports = mongoose.model("StudyGroup", StudyGroupSchema);
