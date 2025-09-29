const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")
const fundRaiserController = require("../controllers/fundRaiserController")

router.get("/no-of-approved-fund-raisers", authMiddleware, fundRaiserController.getNoOfApprovedFundraisers)
router.post("/create", authMiddleware, fundRaiserController.createFundraiser);
router.get("/get-approved-fundraisers", authMiddleware, fundRaiserController.getApprovedfundRaisers)

module.exports = router;  // ✅ must export the router itself
