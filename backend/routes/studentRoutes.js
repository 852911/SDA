const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Student Sign-up
router.post("/signup", studentController.signUp);

// Get all students (optional)

module.exports = router;
