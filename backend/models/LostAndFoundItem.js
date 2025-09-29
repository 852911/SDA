const mongoose = require("mongoose");

const lostAndFoundItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },          // e.g., "Lost Backpack"
    description: { type: String, required: true },    // details
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // who reported
    finder: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },   // who found it
    isClaimed: { type: Boolean, default: false },    // claimed status
    dateReported: { type: Date, default: Date.now }  // report date
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostAndFoundItem", lostAndFoundItemSchema);
