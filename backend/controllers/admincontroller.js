const User = require("../models/UserModel");
const Course = require("../models/courseModel");
const Engagement = require("../models/quizScore");
const Discussion = require("../models/discussion");
const Feedback = require("../models/courseModel"); // Feedback is part of Course schema
const Quiz = require("../models/quizModel");

// Controller to fetch total users
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch total courses
exports.getTotalCourses = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    res.json({ totalCourses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch total engagements
exports.getTotalEngagements = async (req, res) => {
  try {
    const totalEngagements = await Engagement.aggregate([
      { $group: { _id: null, totalTimeSpent: { $sum: "$timeSpent" } } },
    ]);
    const total = totalEngagements.length
      ? totalEngagements[0].totalTimeSpent
      : 0;
    res.json({ totalEngagements: total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch top courses by engagement (most time spent)
exports.getTopCourses = async (req, res) => {
  try {
    const topCourses = await Engagement.aggregate([
      {
        $group: {
          _id: "$courseId",
          totalTimeSpent: { $sum: "$timeSpent" },
        },
      },
      { $sort: { totalTimeSpent: -1 } },
      { $limit: 5 },
    ]).exec();

    const courseDetails = await Course.find({
      _id: { $in: topCourses.map((course) => course._id) },
    });

    res.json(courseDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch recent feedback
exports.getRecentFeedback = async (req, res) => {
  try {
    const coursesWithFeedback = await Course.find({
      feedbacks: { $exists: true, $ne: [] },
    })
      .select("course_name feedbacks")
      .populate("feedbacks.user", "name")
      .sort({ "feedbacks.createdAt": -1 })
      .limit(5);

    res.json(coursesWithFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch recent discussions
exports.getRecentDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to calculate average quiz scores across all courses
exports.getAverageQuizScores = async (req, res) => {
  try {
    const averageScores = await Engagement.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" },
        },
      },
    ]);

    const avgScore = averageScores.length ? averageScores[0].avgScore : 0;
    res.json({ averageQuizScore: avgScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to calculate course completion rate
exports.getCourseCompletionRate = async (req, res) => {
  try {
    const completedCourses = await User.aggregate([
      { $unwind: "$courses" },
      { $match: { "courses.completed": true } },
      { $group: { _id: "$courses.courseId", totalCompleted: { $sum: 1 } } },
    ]);

    const totalCourses = await User.aggregate([
      { $unwind: "$courses" },
      { $group: { _id: "$courses.courseId", total: { $sum: 1 } } },
    ]);

    const completionRate =
      (completedCourses.length / totalCourses.length) * 100;

    res.json({ completionRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    // Fetch total users
    const totalUsers = await User.countDocuments();

    // Fetch total courses
    const totalCourses = await Course.countDocuments();

    // Fetch total engagements
    const totalEngagements = await Engagement.aggregate([
      { $group: { _id: null, totalTimeSpent: { $sum: "$timeSpent" } } },
    ]);
    const totalEngagementsValue = totalEngagements.length
      ? totalEngagements[0].totalTimeSpent
      : 0;

    // Fetch top courses by engagement
    const topCourses = await Engagement.aggregate([
      {
        $group: {
          _id: "$courseId",
          totalTimeSpent: { $sum: "$timeSpent" },
        },
      },
      { $sort: { totalTimeSpent: -1 } },
      { $limit: 5 },
    ]);

    const courseDetails = await Course.find({
      _id: { $in: topCourses.map((course) => course._id) },
    });

    // Fetch recent feedback
    const recentFeedback = await Course.find({
      feedbacks: { $exists: true, $ne: [] },
    })
      .select("course_name feedbacks")
      .populate("feedbacks.user", "name")
      .sort({ "feedbacks.createdAt": -1 })
      .limit(5);

    // Fetch recent discussions
    const recentDiscussions = await Discussion.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch average quiz scores
    const averageScores = await Engagement.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" },
        },
      },
    ]);
    const avgScore = averageScores.length ? averageScores[0].avgScore : 0;

    // Fetch course completion rate
    const completedCourses = await User.aggregate([
      { $unwind: "$courses" },
      { $match: { "courses.completed": true } },
      { $group: { _id: "$courses.courseId", totalCompleted: { $sum: 1 } } },
    ]);

    const totalCoursesCompleted = await User.aggregate([
      { $unwind: "$courses" },
      { $group: { _id: "$courses.courseId", total: { $sum: 1 } } },
    ]);

    const completionRate =
      (completedCourses.length / totalCoursesCompleted.length) * 100;

    // Send consolidated response
    res.json({
      users: totalUsers,
      courses: totalCourses,
      engagements: totalEngagementsValue,
      avgScore: avgScore,
      completionRate: completionRate,
      topCourses: courseDetails,
      recentFeedback: recentFeedback,
      recentDiscussions: recentDiscussions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
