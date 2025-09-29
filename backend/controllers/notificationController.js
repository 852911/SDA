// controllers/userController.js
const jwt = require("jsonwebtoken");
const { Student, Notification } = require("../oop/OOP"); // import your OOP classes
const StudentModel = require("../models/studentModel"); // Mongoose model
const NotificationModel = require("../models/notificationModel")
/**
 * Get notifications for the current logged-in user
 * User is authenticated via JWT token in the Authorization header
 * Header format: "Authorization: Bearer <token>"
 */
// controllers/userController.js
exports.getNotifications = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const studentDoc = await StudentModel.findById(userId).populate("notifications");
    if (!studentDoc) return res.status(404).json({ error: "User not found" });

    const studentOOP = new Student(
      studentDoc._id,
      studentDoc.name,
      studentDoc.email,
      studentDoc.contact,
      studentDoc.rollNo,
      studentDoc.degree,
      studentDoc.campus,
      studentDoc.batch,
      studentDoc.password
    );

    // Add notifications
    studentDoc.notifications.forEach((notifDoc) => {
      const notif = new Notification(notifDoc.message, notifDoc.date, notifDoc.isRead);
      notif._id = notifDoc._id.toString(); // Attach MongoDB _id
      studentOOP.addNotification(notif);
    });

    // IMPORTANT: return objects, not formatted strings
    res.status(200).json({
      message: "Notifications fetched successfully",
      notifications: studentOOP.viewNotification().map((n) => ({
        _id: n._id,
        message: n.message,
        date: n.date,
        isRead: n.isRead,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const studentDoc = await StudentModel.findById(userId).populate("notifications");
    if (!studentDoc) return res.status(404).json({ error: "User not found" });

    const studentOOP = new Student(
      studentDoc._id,
      studentDoc.name,
      studentDoc.email,
      studentDoc.contact,
      studentDoc.rollNo,
      studentDoc.degree,
      studentDoc.campus,
      studentDoc.batch,
      studentDoc.password
    );

    studentDoc.notifications.forEach((notifDoc) => {
      const notif = new Notification(notifDoc.message, notifDoc.date, notifDoc.isRead);
      notif._id = notifDoc._id.toString();
      if (notifDoc.isRead) notif.markAsRead();
      studentOOP.addNotification(notif);
    });

    const notifId = req.params.id;
    const notification = studentOOP.viewNotification().find((n) => n._id === notifId);
    if (!notification) return res.status(404).json({ error: "Notification not found" });

    notification.markAsRead();

    res.status(200).json({
      message: "Notification fetched successfully",
      notification: notification.viewObj(), // return object instead of formatted string
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controller
exports.markAsRead = async (req, res) => {
  try {
    const notifId = req.params.id;
    const notifDoc = await NotificationModel.findById(notifId);
    if (!notifDoc) return res.status(404).json({ error: "Notification not found" });

    notifDoc.isRead = true;
    await notifDoc.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification: notifDoc
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteNotification = async (req, res) => {
  try {
    const notifId = req.params.id;

    // 1. Delete from Notification collection
    const deletedNotif = await NotificationModel.findByIdAndDelete(notifId);
    if (!deletedNotif) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // 2. Remove its reference from all students that had it
    await StudentModel.updateMany(
      { notifications: notifId },
      { $pull: { notifications: notifId } }
    );

    // 3. Wrap in OOP class if needed
    const notifOOP = new Notification(deletedNotif.message);
    if (deletedNotif.isRead) notifOOP.markAsRead();

    res.status(200).json({
      message: "Notification deleted successfully",
      notification: notifOOP.view()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllNotification = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware

    // 1. Find the student with all notifications populated
    const studentDoc = await StudentModel.findById(userId).populate("notifications");
    if (!studentDoc) return res.status(404).json({ error: "User not found" });

    // 2. Collect notification IDs
    const notifIds = studentDoc.notifications.map(n => n._id);

    if (notifIds.length === 0) {
      return res.status(200).json({ message: "No notifications to delete" });
    }

    // 3. Delete all notifications from Notification collection
    await NotificationModel.deleteMany({ _id: { $in: notifIds } });

    // 4. Clear student’s notifications array
    studentDoc.notifications = [];
    await studentDoc.save();

    // 5. Wrap OOP
    const studentOOP = new Student(
      studentDoc._id,
      studentDoc.name,
      studentDoc.email,
      studentDoc.contact,
      studentDoc.rollNo,
      studentDoc.degree,
      studentDoc.campus,
      studentDoc.batch,
      studentDoc.password
    );

    // Return empty array (since all deleted)
    res.status(200).json({
      message: "All notifications deleted successfully",
      notifications: studentOOP.viewNotification()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// controllers/userController.js

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware

    // 1. Find student with notifications
    const studentDoc = await StudentModel.findById(userId).populate("notifications");
    if (!studentDoc) return res.status(404).json({ error: "User not found" });

    // 2. Update all notifications for that user
    await NotificationModel.updateMany(
      { _id: { $in: studentDoc.notifications } },
      { $set: { isRead: true } }
    );

    // 3. Re-fetch updated notifications
    const updatedStudent = await StudentModel.findById(userId).populate("notifications");

    // 4. Wrap in OOP Student
    const studentOOP = new Student(
      updatedStudent._id,
      updatedStudent.name,
      updatedStudent.email,
      updatedStudent.contact,
      updatedStudent.rollNo,
      updatedStudent.degree,
      updatedStudent.campus,
      updatedStudent.batch,
      updatedStudent.password
    );

    updatedStudent.notifications.forEach((notifDoc) => {
      const notif = new Notification(notifDoc.message, notifDoc.date, notifDoc.isRead);
      notif._id = notifDoc._id.toString();
      if (notifDoc.isRead) notif.markAsRead();
      studentOOP.addNotification(notif);
    });

    res.status(200).json({
      message: "All notifications marked as read",
      notifications: studentOOP.viewNotification().map((n) => ({
        _id: n._id,
        message: n.message,
        date: n.date,
        isRead: n.isRead,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
