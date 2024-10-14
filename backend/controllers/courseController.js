const asyncHandler = require("express-async-handler");

const Course = require("../models/courseModel");
const Section = require("../models/sectionModel");
const Video = require("../models/videoModel");
const Quiz = require("../models/quizModel");

// @desc Get Courses
// @route GET /api/courses
// @access Public

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();
  res.status(200).json(courses);
});

// @desc Get Courses
// @route GET /api/courses/all
// @access Public

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();
  res.status(200).json(courses);
});

const getCoursesById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const course = await Course.findById(id)
    .populate({
      path: "sections",
      populate: {
        path: "video_ids", // Populate the video_ids
        model: "Video", // Specify the model
      },
    })
    .populate({
      path: "sections",
      populate: {
        path: "quiz_ids", // If you need to populate quizzes as well
        model: "Quiz",
      },
    });

  res.status(200).json(course);
});

// @desc Set Course
// @route POST /api/Courses/addcourse
// @access Private

const setCourse = asyncHandler(async (req, res) => {
  // Create the course
  const course = new Course({
    course_name: req.body.course_name,
    course_details: req.body.course_details,
    author: req.body.author,
    level: req.body.level,
    category: req.body.category,
    course_img: req.body.course_img,
    author_img: req.body.author_img,
  });

  // Save the course
  const savedCourse = await course.save();
  console.log("Course saved:", savedCourse._id); // Log saved course ID

  // Process sections
  if (req.body.sections) {
    for (let section of req.body.sections) {
      // Create a new section
      const newSection = new Section({
        section_name: section.section_name,
        section_text: section.section_text,
      });

      // Add videos to the section
      if (section.videos) {
        for (let video of section.videos) {
          const newVideo = new Video({
            video_url: video.video_url,
            video_title: video.video_title,
          });

          // Save the video
          const savedVideo = await newVideo.save();
          console.log("Video saved:", savedVideo._id); // Log saved video ID

          // Push video ID to section
          newSection.video_ids.push(savedVideo._id);
        }
      }

      // Add quizzes to the section
      if (section.quizzes) {
        for (let quiz of section.quizzes) {
          const newQuiz = new Quiz({
            quiz_title: quiz.quiz_title,
          });

          // Add quiz questions if provided
          if (quiz.questions) {
            for (let q of quiz.questions) {
              const newQuestion = {
                question_text: q.question_text,
                options: q.options,
                correct_answer: q.correct_answer,
              };
              newQuiz.questions.push(newQuestion);
            }
          }

          // Save the quiz
          const savedQuiz = await newQuiz.save();
          console.log("Quiz saved:", savedQuiz._id); // Log saved quiz ID

          // Push quiz ID to section
          newSection.quiz_ids.push(savedQuiz._id);
        }
      }

      // Save the section
      const savedSection = await newSection.save();
      console.log("Section saved:", savedSection._id); // Log saved section ID

      // Add the section to the course
      savedCourse.sections.push(savedSection._id);
    }
  }

  // Save the updated course with sections
  const updatedCourse = await savedCourse.save();
  console.log("Updated course:", updatedCourse); // Log the updated course

  // Send response
  res.status(201).json(updatedCourse);
});

// @desc Update course
// @route PUT /api/courses/:id
// @access Private

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(400);
    throw new Error("course not found");
  }
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedCourse);
});
// @desc Delete course
// @route DELETE /api/goals/:id
// @access Private

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(400);
    throw new Error("Course not found");
  }

  await course.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCourses,
  getAllCourses,
  getCoursesById,
  setCourse,
  updateCourse,
  deleteCourse,
};
