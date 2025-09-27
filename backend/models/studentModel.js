const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },

    // ✅ degree and campus as references, batch is just a string
    degree: { type: mongoose.Schema.Types.ObjectId, ref: "Degree", required: true },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: "Campus", required: true },
    batch: { type: String, required: true },  // e.g. "Fall 2023", "2023-A"

    organisedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup" }],
    joinedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup" }],
    organisedFundRaisers: [{ type: mongoose.Schema.Types.ObjectId, ref: "FundRaising" }],
    donationsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],

    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]

  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);


/*const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    degree: { type: String, required: true },
    batch: { type: String, required: true },
    organisedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup" }],
    joinedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup" }],
    organisedFundRaisers: [{ type: mongoose.Schema.Types.ObjectId, ref: "FundRaising" }],
    donationsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
    notifications: [
      {
        message: String,
        isRead: { type: Boolean, default: false },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
*/