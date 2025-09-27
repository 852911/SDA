const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  fundRaiser: { type: mongoose.Schema.Types.ObjectId, ref: "FundRaising", required: true },
  amount: { type: Number, required: true },
  dateOfDonation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donation", DonationSchema);
