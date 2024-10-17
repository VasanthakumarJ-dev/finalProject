// CoursesManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../../../components/admin/card/course";
import AddCourseModal from "../../../components/admin/modal";

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching courses");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${id}`);
        setCourses(courses.filter((course) => course._id !== id));
      } catch (err) {
        setError("Error deleting course");
      }
    }
  };
  console.log("showModal in CoursesManagement:", showModal);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 ml-4 mt-4 rounded-lg bg-white h-[calc(100%-1rem)]">
      <div className="flex pl-2 pr-2 justify-between">
        <h1 className="text-2xl font-bold mb-4">Courses Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 rounded-lg hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4"
        >
          Add Course
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <AddCourseModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default CoursesManagement;
