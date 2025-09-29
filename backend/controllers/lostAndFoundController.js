// MongoDB models
const LostAndFoundModel = require("../models/LostAndFoundItem");
const StudentModel = require("../models/studentModel");

// OOP classes
const { Student: OOPStudent, LostAndFoundItem: OOPLostItem } = require("../oop/OOP");

exports.getNoofLostAndFound = async (req, res) => {
  try {
    // Fetch all lost-and-found items from DB
    const items = await LostAndFoundModel.find().populate("reporter finder");

    // Convert MongoDB docs to OOP objects to use methods like viewDetails()
    const oopItems = items.map(item =>
      new OOPLostItem(
        item._id,
        item.title,
        item.description,
        item.reporter,
        item.finder,
        item.isClaimed,
        item.dateReported
      )
    );

    return res.status(200).json({
      success: true,
      data: {
        totalLostAndFound: oopItems.length,  // ✅ total number of items
        retrievedAt: new Date(),
        items: oopItems.map(i => i.viewDetails())
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};