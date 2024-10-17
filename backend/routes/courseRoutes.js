const express = require("express");
const {
  getCourses,
  setCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCoursesById,
} = require("../controllers/courseController");
const Discussion = require("../models/discussion");
const router = express.Router();

router.get("/", getCourses);

//Gettting all the courses
router.get("/all", getAllCourses);

//Get course by ID
router.get("/:id", getCoursesById);

router.post("/addcourse", setCourse);

router.route("/:id").put(updateCourse).delete(deleteCourse);

// Assuming you have a Discussion model

// Fetch discussions for a course
router.get("/:id/discussions", async (req, res) => {
  const { id } = req.params; // Using 'id' since it's passed as a URL parameter

  try {
    const discussions = await Discussion.find({ courseId: id });
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching discussions" });
  }
});

// const mongoose = require("mongoose");

router.post("/:id/discussions", async (req, res) => {
  const { id: courseId } = req.params; // Rename 'id' to 'courseId'
  const { userId, message } = req.body;

  try {
    // Ensure both 'courseId' and 'userId' are valid ObjectId types
    const newDiscussion = new Discussion({
      courseId, // Correctly pass courseId from the URL params
      userId, // Convert userId to ObjectId
      message,
      createdAt: new Date(),
    });

    await newDiscussion.save();
    res.status(201).json(newDiscussion);
  } catch (error) {
    console.error("Error:", error); // Log the full error for debugging
    res
      .status(500)
      .json({ message: "Error creating discussion", error: error.message }); // Send error details
  }
});

// Add a new discussion
// router.post("/:id/discussions", async (req, res) => {
//   const { id: courseId } = req.params;
//   const { userId, message } = req.body;
//   console.log(courseId);
//   try {
//     const newDiscussion = new Discussion({
//       courseId,
//       userId,
//       message,
//       createdAt: new Date(),
//     });
//     await newDiscussion.save();
//     res.status(201).json(newDiscussion);
//   } catch (error) {
//     res.status(500).json({ "Error creating discussion": error });
//   }
// });

module.exports = router;
