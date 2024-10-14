import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Card } from "antd";

const UserMetrics = ({ userId }) => {
  const [metrics, setMetrics] = useState({
    totalTimeSpent: 78,
    quizScores: [],
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/metrics`
        );
        setMetrics(response.data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, [userId]);

  // Prepare data for the total time spent chart
  const timeSpentData = {
    options: {
      chart: {
        id: "total-time-spent",
      },
      title: {
        text: "Total Time Spent on Courses (seconds)",
      },
      labels: ["Time Spent"],
    },
    series: [metrics.totalTimeSpent],
  };

  // Prepare data for the quiz scores chart
  const quizScoresData = {
    options: {
      chart: {
        id: "quiz-scores",
        type: "bar",
      },
      xaxis: {
        categories: metrics.quizScores.map((score) => score.title), // Using quiz titles
      },
      title: {
        text: "Quiz Scores",
      },
    },
    series: [
      {
        name: "Scores",
        data: metrics.quizScores.map((score) => score.score),
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg mt-4 mr-2 ml-4">
      <h1 className="text-2xl font-bold mb-4">User Metrics</h1>
      <div className="flex justify-between w-full">
        <div className="mb-8 w-1/5">
          <Card title="Total Time Spent" bordered={true}>
            <div style={{ textAlign: "center", fontSize: "30px" }}>
              <strong>{metrics.totalTimeSpent} hrs</strong>
            </div>
          </Card>
        </div>
        <div className="mb-8 w-1/5">
          <Card title="course completion" bordered={true}>
            <div style={{ textAlign: "center", fontSize: "30px" }}>
              <strong>3</strong>
            </div>
          </Card>
        </div>

        <div className="mb-8 w-1/5">
          <Card title="on going courses" bordered={true}>
            <div style={{ textAlign: "center", fontSize: "30px" }}>
              <strong>3</strong>
            </div>
          </Card>
        </div>

        <div className="mb-8 w-1/5">
          <Card title="completion percentage" bordered={true}>
            <div style={{ textAlign: "center", fontSize: "30px" }}>
              <strong>83%</strong>
            </div>
          </Card>
        </div>
      </div>
      <div className="mb-8">
        <Chart
          options={quizScoresData.options}
          series={quizScoresData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default UserMetrics;
