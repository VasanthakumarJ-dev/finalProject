// const express = require("express");
// const router = express.Router();
// const {
//   createCourse,
//   createQuiz,
//   getUserScores,
// } = require("../controllers/adminController");
// const { protect, admin } = require("../middleware/authMiddleware");

// // @desc Create a new course
// // @route POST /api/admin/courses
// // @access Private/Admin
// router.post("/courses", protect, admin, createCourse);

// // @desc Create a new quiz
// // @route POST /api/admin/quizzes
// // @access Private/Admin
// router.post("/quizzes", protect, admin, createQuiz);

// // @desc Get user scores for a specific quiz
// // @route GET /api/admin/scores/:quizId
// // @access Private/Admin
// router.get("/scores/:quizId", protect, admin, getUserScores);

// module.exports = router;
