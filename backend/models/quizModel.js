const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define a question schema
const questionSchema = new Schema({
  question_text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct_answer: { type: Number, required: true },
});

// Define the quiz schema
const quizSchema = new Schema({
  quiz_title: { type: String, required: true },
  questions: [questionSchema], // Array of questions
});

module.exports = mongoose.model("Quiz", quizSchema);
