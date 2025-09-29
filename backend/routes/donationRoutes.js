// routes/fundRaiserRoutes.js
const express = require("express");
const router = express.Router();
const fundRaiserController = require("../controllers/fundRaiserController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/donate/:fundraiserId", authMiddleware, fundRaiserController.donateToFundraiser);

module.exports = router;
