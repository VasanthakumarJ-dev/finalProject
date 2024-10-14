const express = require("express");
const router = express.Router();
const {
  loginUser,
  getMe,
  registerUser,
  updateUserRole,
  completeCourse,
  metrics,
  submitQuizScore,
  getUserQuizScores,
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/:userId/metrics", metrics);
router.put("/:id/role", protect, admin, updateUserRole);
router.post("/:userId/complete-course/:courseId", protect, completeCourse);
// Route to submit a quiz score
router.post("/:userId/submit", submitQuizScore);

// Route to get user's quiz scores
router.get("/:userId/score", getUserQuizScores);
module.exports = router;
