const express = require('express');
const router = express.Router();
const notificationController = require("../controllers/notificationController")
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/", notificationController.getNotifications);
router.get("/:id", notificationController.getNotificationById);
router.post("/:id/mark-read", authMiddleware, notificationController.markAsRead);
router.delete("/:id/delete-notification", authMiddleware, notificationController.deleteNotification);
router.delete("/delete-all-notifications", authMiddleware, notificationController.deleteAllNotification);
router.post("/mark-all-as-read", authMiddleware, notificationController.markAllAsRead);


module.exports = router;  // ✅ must export the router itself
