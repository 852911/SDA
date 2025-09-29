const mongoose = require("mongoose");

const FundRaisingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discription: { type: String, required: true },
  organiser: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  goalAmount: { type: Number, required: true },
  collectedAmount: { type: Number, default: 0 },
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
  isApproved: { type: String, enum: ["yes", "no", "rejected"], default: "no" },
  status: { type: String, enum: ["ongoing", "completed", "closed"], default: "ongoing" }
});

module.exports = mongoose.model("FundRaising", FundRaisingSchema);
