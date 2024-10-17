import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { Card, Statistic } from "antd";
import axios from "axios";

function CourseCompletionChart({ userId }) {
  const [metrics, setMetrics] = useState({
    totalTimeSpent: 0,
    engagementCount: 0,
    quizScores: [],
  });

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

  // useEffect(() => {
  //   if (metrics.quizScores?.length > 0) {
  //     const data =
  //       metrics.quizScores && metrics.quizScores?.map((score) => score.score); // Adjust based on your requirements
  //     const categories =
  //       metrics.quizScores && metrics.quizScores?.map((score) => score.title); // Assuming titles are quiz titles
  //     console.log(data);
  //     const options = {
  //       chart: { type: "bar" },
  //       series: [{ name: "Quiz Scores", data: data }],
  //       xaxis: { categories: categories },
  //     };
  //     // console.log(document.querySelector("#courseCompletionChart"));
  //     // const chart = new ApexCharts(
  //     //   document.querySelector("#courseCompletionChart"),
  //     //   options
  //     // );
  //     // chart.render();

  //     // Cleanup chart on unmount
  //     return () => {
  //       chart.destroy();
  //     };
  //   }
  // }, [metrics]);

  return (
    <Card title="Course Completion Metrics" style={{ margin: "20px" }}>
      <Statistic
        title="Engagement Count"
        value={metrics.engagementCount}
        style={{ marginTop: 16 }}
      />
      {/* <div id="courseCompletionChart" style={{ marginTop: "20px" }}></div> */}
    </Card>
  );
}

export default CourseCompletionChart;
