const StudyGroup = require("../models/studyGroupsModel"); // MongoDB model
const { StudyGroup: OOPStudyGroup } = require("../oop/OOP"); // OOP class

const groupController = {

  getTotalGroups: async (req, res) => {
    try {
      const groups = await StudyGroup.find(); // fetch all groups
      // Convert to OOP objects if needed
      const oopGroups = groups.map(
        g => new OOPStudyGroup(g._id, g.name, g.subject, g.organizer)
      );

      return res.status(200).json({
        success: true,
        data: {
          totalGroups: oopGroups.length,
          retrievedAt: new Date(),
          groups: oopGroups.map(g => g.viewDetails()) // optional
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }

};

module.exports = groupController;
