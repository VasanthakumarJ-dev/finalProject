const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Discussion schema
const discussionSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Feedback schema
const feedbackSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Course schema
const courseSchema = new Schema(
  {
    course_name: { type: String, required: true },
    course_details: { type: String, required: true },
    author: { type: String, required: true },
    level: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["fullstack", "data engineering", "data science", "gen AI"],
    },
    course_img: { type: String, required: true },
    author_img: { type: String, required: true },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    discussions: [discussionSchema], // Array of discussions
    feedbacks: [feedbackSchema], // Array of feedbacks
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
