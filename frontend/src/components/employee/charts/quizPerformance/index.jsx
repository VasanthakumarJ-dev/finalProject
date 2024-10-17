import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import { Card } from "antd";

function QuizPerformanceChart({ userId }) {
  const [metrics, setMetrics] = useState({
    totalTimeSpent: 0,
    engagementCount: 0,
    quizScores: [],
  });
  const chartRef = useRef(null); // Ref to store the chart instance

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/metrics/${userId}`
        );
        setMetrics(response.data); // Store the metrics in state
      } catch (error) {
        console.error("Error fetching user metrics:", error);
      }
    };

    fetchMetrics();
  }, [userId]);

  useEffect(() => {
    if (metrics.quizScores.length > 0) {
      const data = metrics.quizScores.map((score) => score.score); // Fetch quiz scores
      const categories = metrics.quizScores.map(
        (score) => score.title || `Quiz ${score.courseId}`
      ); // Fallback title if title is not present

      const options = {
        chart: { type: "bar", height: "200px" }, // Adjusted height
        series: [{ name: "Quiz Scores", data: data }],
        xaxis: { categories: categories },
      };

      // Create chart instance if it doesn't already exist
      if (!chartRef.current) {
        chartRef.current = new ApexCharts(
          document.querySelector("#quizPerformanceChart"),
          options
        );
        chartRef.current.render();
      } else {
        chartRef.current.updateOptions(options); // Update the chart with new options
      }
    }

    // Cleanup chart on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null; // Reset the reference
      }
    };
  }, [metrics]);

  return (
    <Card title="Quiz Performance Metrics" style={{ margin: "20px" }}>
      <div
        id="quizPerformanceChart"
        style={{ height: "200px", marginTop: "20px" }}
      ></div>
    </Card>
  );
}

export default QuizPerformanceChart;
