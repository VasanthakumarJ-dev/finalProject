import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table } from "antd";

function UserActivityTable({ userId }) {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/metrics/${userId}`)
      .then((response) => {
        const userMetrics = {
          completedCourses: response.data.quizScores || [], // Assuming quizScores has courseId and scores
          totalTimeSpent: response.data.totalTimeSpent,
        };
        setActivity([userMetrics]); // Wrap in array for mapping
      })
      .catch((error) => {
        console.error("Error fetching user metrics:", error);
      });
  }, [userId]);

  const columns = [
    { title: "Course Title", dataIndex: "title", key: "title", width: "50%" }, // Set width for Course Title
    {
      title: "Last Quiz Score",
      dataIndex: "lastScore",
      key: "lastScore",
      width: "25%",
    }, // Set width for Last Quiz Score
    {
      title: "Total Time Spent",
      dataIndex: "totalTimeSpent",
      key: "totalTimeSpent",
      width: "25%", // Set width for Total Time Spent
    },
  ];

  const dataSource = activity.flatMap((user) =>
    user.completedCourses.map((score) => ({
      key: score.courseId, // Assuming courseId is unique
      title: score.courseName || `Course ${score.courseId}`, // Use courseName instead of courseId
      lastScore: score.score || "N/A", // Score for the last quiz taken in this course
      totalTimeSpent: user.totalTimeSpent, // Total time spent on the course
    }))
  );

  return (
    <Card title="User Activity Table" style={{ width: 800, margin: "20px" }}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered // Optional: Add borders for better visibility
      />
    </Card>
  );
}

export default UserActivityTable;
