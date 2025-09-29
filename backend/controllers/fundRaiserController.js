const AdminModel = require("../models/AdminModel")
const StudentModel = require("../models/studentModel")
const FundRaisingModel = require("../models/fundRaisingModel"); // Mongoose schema
const NotificationModel = require("../models/notificationModel");
const { Student, FundRaising, Notification } = require("../oop/OOP");

// POST /api/fundraisers/create
exports.createFundraiser = async (req, res) => {
  try {
    const { title, description, goal } = req.body;
    const studentId = req.user.id; // set by auth middleware

    if (!title || !description || !goal) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ Fetch student from DB
    const studentDoc = await StudentModel.findById(studentId);
    if (!studentDoc) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Create fundraiser document (request)
    const newFundraiser = await FundRaisingModel.create({
      title,
      discription: description,
      organiser: studentId,
      goalAmount: goal,
      collectedAmount: 0,
      donations: [],
      isApproved: "no",
      status: "ongoing",
    });

    // 3️⃣ Add fundraiser request to student's requestedFundRaisers
    studentDoc.requestedFundRaisers.push(newFundraiser._id);

    // 4️⃣ Create student notification and save
    const studentNotifOOP = new Notification(
      `Your fundraiser request "${title}" has been sent to the admin.`
    );
    const studentNotifDB = await NotificationModel.create({
      message: studentNotifOOP.message,
      isRead: studentNotifOOP.isRead,
      date: studentNotifOOP.date,
    });
    studentDoc.notifications.push(studentNotifDB._id);

    await studentDoc.save();

    // 5️⃣ Notify the single admin
    const adminDoc = await AdminModel.findOne(); // get the only admin
    if (adminDoc) {
      // Add fundraiser request to admin's list
      adminDoc.requestedFundRaisers.push(newFundraiser._id);

      // Create admin notification and save
      const adminNotifOOP = new Notification(
        `New fundraiser request "${title}" received from ${studentDoc.name}.`
      );
      const adminNotifDB = await NotificationModel.create({
        message: adminNotifOOP.message,
        isRead: adminNotifOOP.isRead,
        date: adminNotifOOP.date,
      });
      adminDoc.notifications.push(adminNotifDB._id);

      await adminDoc.save();
    }

    // ✅ Return success response
    return res.status(201).json({
      message: "Your request has been sent to the admin",
      fundraiserId: newFundraiser._id,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error creating fundraiser request",
      error: err.message,
    });
  }
};

exports.getNoOfApprovedFundraisers = async(req, res) => {
    try {
      // Fetch from MongoDB
      const approvedFundraisers = await FundRaisingModel.find({
        isApproved: "yes"
      });

      // Convert DB results into OOP objects
      const fundraisersOOP = approvedFundraisers.map(f =>
        new FundRaising(
          f._id,
          f.title,
          f.organiser,
          f.goalAmount,
          f.collectedAmount,
          f.donations
        )
      );

      // Example: OOP method for progress
      const progressSummary = fundraisersOOP.map(fr => fr.getProgress());

      return res.status(200).json({
        message: "Approved fundraisers retrieved successfully",
        data: {
          totalApprovedFundraisers: fundraisersOOP.length,
          retrievedAt: new Date(),
          progressSummary
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error fetching approved fundraisers",
        error: error.message
      });
    }
  }
exports.getApprovedfundRaisers = async (req, res) => {
  try {
    // Fetch approved fundraisers and populate organiser details
    const approvedFundraisers = await FundRaisingModel.find({ isApproved: "yes" })
      .populate("organiser", "name email contact rollNo degree batch campus") // select fields
      .lean(); // convert to plain JS object

    // Optional: calculate progress
    const fundraisersWithProgress = approvedFundraisers.map(f => ({
      ...f,
      progress: ((f.collectedAmount / f.goalAmount) * 100).toFixed(2) + "%",
    }));

    return res.status(200).json({
      message: "Approved fundraisers retrieved successfully",
      data: fundraisersWithProgress
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching approved fundraisers",
      error: error.message
    });
  }
};


exports.donateToFundraiser = async (req, res) => {
  try {
    const { amount } = req.body;
    const fundraiserId = req.params.fundraiserId;
    const donorId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Donation amount must be greater than 0" });
    }

    // 1️⃣ Check fundraiser
    const fundraiser = await FundRaisingModel.findById(fundraiserId);
    if (!fundraiser || fundraiser.isApproved !== "yes") {
      return res.status(404).json({ message: "Fundraiser not found or not approved" });
    }

    // 2️⃣ Create donation
    const donation = await DonationModel.create({
      donor: donorId,
      fundRaiser: fundraiserId,
      amount,
    });

    // 3️⃣ Update fundraiser's collected amount
    fundraiser.collectedAmount += amount;
    fundraiser.donations.push(donation._id);
    await fundraiser.save();

    return res.status(200).json({
      message: "Donation successful",
      donationId: donation._id,
      newCollectedAmount: fundraiser.collectedAmount,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error processing donation", error: error.message });
  }
};