import React, { useContext } from "react";
import CourseCompletionChart from "../components/employee/charts/courseCompletion";
import EngagementChart from "../components/employee/charts/engagement";
import QuizPerformanceChart from "../components/employee/charts/quizPerformance";
import TopCoursesChart from "../components/employee/charts/topCourse";
import UserActivityTable from "../components/employee/table/userActivity";
import { AuthContext } from "../CustomHooks/authContext"; // Adjust to your path
import { jwtDecode } from "jwt-decode"; // Corrected import

function App() {
  const { token } = useContext(AuthContext);
  const userId = token ? jwtDecode(token).id : null; // Assuming your token contains the userId

  return (
    <div className="App bg-white rounded-lg p-4 ml-4 mt-4 w-full min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Learning Management System Dashboard
      </h1>

      <div className="flex justify-between gap-4">
        {/* First column */}
        <div className="flex flex-col w-2/4">
          <div className="flex flex-row">
            <div className="flex-1">
              <CourseCompletionChart userId={userId} />
            </div>
            <div className="flex-1">
              <EngagementChart userId={userId} />
            </div>
          </div>
          <QuizPerformanceChart userId={userId} />
        </div>

        {/* Third column */}
        <div className="flex flex-col w-2/4">
          {/* Ensure TopCoursesChart only appears once */}
          <UserActivityTable userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default App;
