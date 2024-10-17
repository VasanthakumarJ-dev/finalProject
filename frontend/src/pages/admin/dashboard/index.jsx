import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table } from "antd";
import Chart from "react-apexcharts";
import axios from "axios"; // Add axios for making API requests

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalEngagements, setTotalEngagements] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [topCourses, setTopCourses] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [recentDiscussions, setRecentDiscussions] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an API request to fetch the dashboard summary data
        const response = await axios.get(
          "http://localhost:5000/api/admin/summary"
        );

        // Destructure the data from the API response
        const {
          users,
          courses,
          engagements,
          avgScore,
          completionRate,
          topCourses,
          recentFeedback,
          recentDiscussions,
        } = response.data;

        // Update the state with the API data
        setTotalUsers(users);
        setTotalCourses(courses);
        setTotalEngagements(engagements);
        setAverageScore(avgScore);
        setTopCourses(topCourses);
        setRecentFeedback(recentFeedback);
        setRecentDiscussions(recentDiscussions);
        setCompletionRate(completionRate);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const topCoursesData = {
    series: [
      {
        name: "Engagement",
        data: topCourses.map((course) => course.totalTimeSpent),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: topCourses.map((course) => course.title || "Unknown"),
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: "Top Courses by Engagement",
        align: "center",
      },
      colors: ["#008FFB"],
    },
  };

  const feedbackColumns = [
    {
      title: "Feedback",
      dataIndex: "feedbacks",
      key: "feedback",
      render: (feedbacks) => feedbacks[0]?.feedback || "No feedback",
    },
    {
      title: "Date",
      dataIndex: "feedbacks",
      key: "createdAt",
      render: (feedbacks) =>
        feedbacks[0]
          ? new Date(feedbacks[0].createdAt).toLocaleString()
          : "N/A",
    },
  ];

  const discussionColumns = [
    {
      title: "Discussion",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div className="bg-white mt-4 ml-4 rounded-lg p-4 h-[calc(100%-1.5rem)]">
      <h1>Admin Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card title="Total Users" bordered={false}>
            {totalUsers}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Total Courses" bordered={false}>
            {totalCourses}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Total Engagements" bordered={false}>
            {totalEngagements}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Average Quiz Score" bordered={false}>
            {averageScore}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="Course Completion Rate" bordered={false}>
            <h2>{completionRate}%</h2>
          </Card>
          <Card title="Recent Feedback" bordered={false}>
            <Table
              dataSource={recentFeedback}
              columns={feedbackColumns}
              pagination={false}
              rowKey="_id"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top Courses by Engagement" bordered={false}>
            <Chart
              options={topCoursesData.options}
              series={topCoursesData.series}
              type="bar"
              height={350}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
