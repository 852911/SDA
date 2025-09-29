const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();



// Import routes
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const groupRoutes = require("./routes/groupRoutes");
const fundRoutes = require("./routes/fundRoutes");
const campusRoutes = require("./routes/campusRoutes")
const degreeRoutes = require("./routes/degreeRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const LostAndFoundRoutes = require("./routes/lostAndFoundRoutes")
const donationRoutes = require("./routes/donationRoutes")

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/study-groups", groupRoutes);
app.use("/api/fundsraisers", fundRoutes);
app.use("/api/campus", campusRoutes);
app.use("/api/degree",degreeRoutes);
app.use("/api/users/notifications", notificationRoutes)
app.use("/api/lost-and-found", LostAndFoundRoutes)
app.use("/api/donations", donationRoutes)

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
