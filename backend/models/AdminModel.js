const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    password: { type: String, required: true }, // hashed password
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
    requestedFundRaisers: [{ type: mongoose.Schema.Types.ObjectId, ref: "FundRaising" }] // new

  },
  { timestamps: true }
);

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
