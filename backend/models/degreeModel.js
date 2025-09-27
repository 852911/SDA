const mongoose = require("mongoose");

const degreeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },      // e.g. BS Computer Science
    duration: { type: String, required: true }   // e.g. 4 years
  },
  { timestamps: true }
);

module.exports = mongoose.model("Degree", degreeSchema);
