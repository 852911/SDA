const StudentModel = require("../models/studentModel"); // Mongoose Student schema
const NotificationModel = require("../models/notificationModel"); // Mongoose Notification
const { Student, Notification } = require("../oop/OOP"); // OOP Student class
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const { name, email, contact, rollNo, degree, batch, password, campus } = req.body;

    // 1. Check if student already exists
    const existing = await StudentModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save student in DB WITHOUT notifications initially
    const studentDoc = await StudentModel.create({
      name,
      email,
      contact,
      password: hashedPassword,
      rollNo,
      degree,
      campus,
      batch,
      organisedGroups: [],
      joinedGroups: [],
      organisedFundRaisers: [],
      donationsGiven: []
    });

    // 4. Create OOP Student instance
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

    // 5. Create Notification (OOP + DB)
    const welcomeNotificationOOP = new Notification(
      `Welcome ${studentOOP.name}! Your account has been created successfully.`
    );
    studentOOP.addNotification(welcomeNotificationOOP);

    // Save notification in DB
    const welcomeNotificationDB = await NotificationModel.create({
      message: welcomeNotificationOOP.message,
      isRead: welcomeNotificationOOP.isRead,
      date: welcomeNotificationOOP.date
    });

    // Link notification to student in DB
    studentDoc.notifications = [welcomeNotificationDB._id];
    await studentDoc.save();

    // 6. Generate JWT
    const token = jwt.sign(
      { id: studentDoc._id, role: "student", email: studentDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 7. Respond with OOP instance and DB notification
    res.status(201).json({
      message: "Student signed up successfully",
      token,
      student: studentOOP,
      notifications: [welcomeNotificationDB]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getStudentCount = async (req, res) => {
  try {
    // 1. Count students in DB
    const totalStudents = await StudentModel.countDocuments();

    // 2. Wrap result in OOP object
    // (For example: we can create a static method in Student class to represent counts)
    const summary = Student.getSummary(totalStudents);

    // 3. Send response
    res.status(200).json({
      message: "Student count retrieved successfully",
      data: summary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};