// CourseCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <img
        src={course.course_img}
        alt={course.course_name}
        className="h-32 w-full object-cover rounded-t-lg"
      />
      <h2 className="text-xl font-semibold mt-2">{course.course_name}</h2>
      <p className="text-gray-700">{course.author}</p>
      <div className="mt-4">
        <Link
          to={`/admin/edit-course/${course._id}`}
          className="btn btn-warning mr-2"
        >
          Edit
        </Link>
        <button className="btn btn-danger" onClick={() => onDelete(course._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
