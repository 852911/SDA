const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    password: { type: String, required: true }, // hashed password

    // common field with User
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

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
