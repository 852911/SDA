const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const groupController = require("../controllers/studyGroupController");

// Route: Get total count of study groups
router.get("/no-of-groups", authMiddleware, groupController.getTotalGroups);

// Other study group routes can go here
// e.g., router.post("/create", authMiddleware, groupController.createGroup);

module.exports = router;
