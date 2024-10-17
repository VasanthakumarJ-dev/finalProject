const express = require("express");
const router = express.Router();
const {
  loginUser,
  getMe,
  registerUser,
  updateUserRole,
  completeCourse,
  submitQuizScore,
  getUserQuizScores,
  userMetrics,
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/authMiddleware");

// User Registration
router.post("/", registerUser);

// User Login
router.post("/login", loginUser);

// Get Current User Data
router.get("/me", getMe);

// User Metrics
// router.get("/:userId/metrics", metrics);

// Update User Role (Admin Only)
router.put("/:id/role", admin, updateUserRole);

// Complete Course
router.put("/complete/:userId/:courseId", completeCourse);

// Submit Quiz Score
router.post("/engagements", submitQuizScore);

// Get User Quiz Scores
router.get("/:userId/scores", getUserQuizScores);

// User Metrics (might be redundant)
router.get("/metrics/:userId", userMetrics);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   loginUser,
//   getMe,
//   registerUser,
//   updateUserRole,
//   completeCourse,
//   metrics,
//   submitQuizScore,
//   getUserQuizScores,
//   userMetrics,
// } = require("../controllers/userController");

// const { protect, admin } = require("../middleware/authMiddleware");

// // User Registration
// router.post("/", registerUser);

// // User Login
// router.post("/login", loginUser);

// // Get Current User Data
// router.get("/me", protect, getMe);

// // User Metrics
// router.get("/:userId/metrics", protect, metrics);

// // Update User Role (Admin Only)
// router.put("/:id/role", protect, admin, updateUserRole);

// // Complete Course
// router.put("/complete/:userId/:courseId", protect, completeCourse);

// // Submit Quiz Score
// router.post("/submit", protect, submitQuizScore);

// // Get User Quiz Scores
// router.get("/:userId/scores", protect, getUserQuizScores);

// // User Metrics (might be redundant)
// router.get("/metrics/:userId", protect, userMetrics);

// module.exports = router;
