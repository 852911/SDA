const express = require("express");
const router = express.Router();
const DegreeModel = require("../models/degreeModel");

// Create a new degree
router.post("/", async (req, res) => {
  try {
    const { name, duration } = req.body;

    if (!name || !duration) {
      return res.status(400).json({ error: "Name and duration are required" });
    }

    const degree = new DegreeModel({ name, duration });
    await degree.save();

    res.status(201).json({ message: "Degree created successfully", degree });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all degrees
router.get("/", async (req, res) => {
  try {
    const degrees = await DegreeModel.find({});
    res.json(degrees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
