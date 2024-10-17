import React, { useEffect } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import { Card, Spin, Alert } from "antd"; // Import Spin and Alert for loading state and error handling

function TopCoursesChart({ userId }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/metrics/${userId}`
        );
        const courses = response.data.quizScores; // Example: Adjust based on the structure of your response
        const data = courses.map((course) => course.score); // Adjust based on what you want to show
        const categories = courses.map((course) => course.title);

        const options = {
          chart: {
            type: "bar",
            height: "200px", // Reduced height
          },
          series: [{ name: "Scores per Course", data: data }],
          xaxis: { categories: categories },
        };

        const chart = new ApexCharts(
          document.querySelector("#topCoursesChart"),
          options
        );
        chart.render();
        setLoading(false); // Stop loading when chart renders
      } catch (err) {
        setError(err.message); // Set error message if request fails
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchMetrics();

    // Cleanup function to destroy the chart instance
    return () => {
      const chartElement = document.querySelector("#topCoursesChart");
      if (chartElement) {
        const chartInstance = ApexCharts.getChartByID("topCoursesChart");
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
  }, [userId]);

  return (
    <Card title="Top Courses Chart" style={{ width: 400, margin: "20px" }}>
      {loading && <Spin size="large" />}{" "}
      {/* Show loading spinner while fetching data */}
      {error && (
        <Alert
          message="Error fetching data"
          description={error}
          type="error"
          showIcon
        />
      )}
      <div id="topCoursesChart" style={{ height: "200px" }}></div>{" "}
      {/* Reduced height */}
    </Card>
  );
}

export default TopCoursesChart;
