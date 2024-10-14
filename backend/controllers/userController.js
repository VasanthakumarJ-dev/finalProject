const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const Quiz = require("../models/quizModel");
const quizScore = require("../models/quizScore");

// @desc Register new user (default role: employee)
// @routes POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields ");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with default role 'employee'
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "employee", // Default role
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, role } = await User.findById(req.user.id);

  res.status(200).json({
    id: _id,
    name,
    email,
    role,
  });
});

// @desc Update user role (admin only)
// @route PUT /api/users/:id/role
// @access Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Only admin can change roles
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as admin");
  }

  user.role = req.body.role || user.role;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

// course completion
const completeCourse = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if the course is already marked as completed
  const courseCompletion = user.courses.find(
    (course) => course.courseId.toString() === courseId
  );
  if (courseCompletion) {
    courseCompletion.completed = true; // Mark as completed
  } else {
    user.courses.push({ courseId, completed: true }); // Add new course completion
  }

  await user.save(); // Save user data
  res.status(200).json({ message: "Course marked as completed" });
});

// metrics

const metrics = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "courses.courseId"
    );

    // Create a dictionary to map quiz IDs to titles
    const quizTitles = await Quiz.find({});
    const quizTitleMap = quizTitles.reduce((acc, quiz) => {
      acc[quiz._id] = quiz.quiz_title;
      return acc;
    }, {});

    // Prepare metrics
    const metrics = {
      totalTimeSpent: user.courses.reduce(
        (total, course) => total + course.timeSpent,
        0
      ),
      quizScores: user.courses.flatMap((course) =>
        course.quizScores.map((quizScore) => ({
          quizId: quizScore.quizId,
          score: quizScore.score,
          title: quizTitleMap[quizScore.quizId] || "Unknown Quiz", // Map ID to title
        }))
      ),
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//
const submitQuizScore = asyncHandler(async (req, res) => {
  const { userId, courseId, score, timeSpent } = req.body;
  const submit = await quizScore.create({
    userId,
    courseId,
    score,
    timeSpent, // Default role
  });

  if (submit) {
    res.status(201).json({
      message: "success",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getUserQuizScores = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    // Use await to wait for the query to complete
    const getquiz = await quizScore.find({ userId: userId }).lean(); // Using .lean() to avoid circular references

    // Check if any scores were found
    if (getquiz.length > 0) {
      res.status(200).json(getquiz); // Return the scores
    } else {
      res.status(404).json({ message: "No quiz scores found for this user." });
    }
  } catch (error) {
    console.error("Error retrieving quiz scores:", error);
    res
      .status(500)
      .json({ message: "Error retrieving quiz scores", error: error.message });
  }
});

// const getUserQuizScores = asyncHandler(async (req, res) => {
//   const { userId } = req.params;
//   const getquiz = quizScore.find({ userId: userId });
//   if (getquiz) {
//     res.status(201).json(getquiz);
//   } else {
//     res.status(404).json({ message: "Error" });
//   }
// });

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserRole,
  completeCourse,
  metrics,
  submitQuizScore,
  getUserQuizScores,
};
