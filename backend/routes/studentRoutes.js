const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")
const studentController = require("../controllers/studentController");

// Student Sign-up
router.post("/signup", studentController.signUp);
router.get("/no-of-students", authMiddleware, studentController.getStudentCount);

// Get all students (optional)

module.exports = router;
