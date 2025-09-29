const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")
const lostAndFoundController = require("../controllers/lostAndFoundController")

router.get("/no-of-lost-and-found", authMiddleware, lostAndFoundController.getNoofLostAndFound);


module.exports = router;  // ✅ must export the router itself
