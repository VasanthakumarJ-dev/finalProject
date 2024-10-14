const mongoose = require("mongoose");
// const quizScoreSchema = require("./quizScore");

const userCourseSchema = mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completed: { type: Boolean, default: false }, // Track if the course is completed
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
    },
    department: {
      type: String,
      required: true,
    },
    courses: [userCourseSchema], // Array to track user course progress
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
