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
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/campus", campusRoutes);
app.use("/api/degree",degreeRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
