const StudentModel = require("../models/studentModel");
const NotificationModel = require("../models/notificationModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Student, Notification } = require("../oop/OOP");

// POST /api/students/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find student by email
    const studentDoc = await StudentModel.findOne({ email }).populate("notifications");
    if (!studentDoc) return res.status(400).json({ error: "Invalid email or password" });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, studentDoc.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // 3. Create OOP Student instance
    const studentOOP = new Student(
      studentDoc._id,
      studentDoc.name,
      studentDoc.email,
      studentDoc.contact,
      studentDoc.rollNo,
      studentDoc.degree,
      studentDoc.batch,
      studentDoc.campus,
      studentDoc.password
    );

    // Add existing notifications to OOP student
    studentDoc.notifications.forEach((notif) => studentOOP.addNotification(notif));

    // 4. Create new login notification
    const loginNotificationOOP = new Notification(
      `Welcome back, ${studentOOP.name}! You have logged in successfully.`
    );
    studentOOP.addNotification(loginNotificationOOP);

    const loginNotificationDB = await NotificationModel.create({
      message: loginNotificationOOP.message,
      isRead: loginNotificationOOP.isRead,
      date: loginNotificationOOP.date
    });

    // Link new notification to student in DB
    studentDoc.notifications.push(loginNotificationDB._id);
    await studentDoc.save();

    // 5. Generate JWT
    const token = jwt.sign(
      { id: studentDoc._id, role: "student", email: studentDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6. Respond
    res.status(200).json({
      message: "Login successful",
      token,
      student: studentOOP,
      notifications: studentDoc.notifications
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
