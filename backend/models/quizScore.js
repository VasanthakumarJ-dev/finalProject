const mongoose = require("mongoose");

const EngagementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  score: {
    type: Number, // Store the quiz score for the course
    required: true,
    default: 0, // Default score is 0
  },
  timeSpent: {
    type: Number, // Store time spent on the course in minutes (or seconds based on preference)
    required: true,
    default: 0, // Default is no time spent
  },
});

module.exports = mongoose.model("Engagement", EngagementSchema);
