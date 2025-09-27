// routes/campus.js
const express = require("express");
const router = express.Router();
const CampusModel = require("../models/campusModel");
router.get("/", async (req, res) => {
  try {
    const campuses = await CampusModel.find({});
    res.json(campuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST to create a new campus
router.post("/", async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required" });
    }

    const newCampus = new CampusModel({ name, location });
    await newCampus.save();

    res.status(201).json({ message: "Campus created successfully", campus: newCampus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
