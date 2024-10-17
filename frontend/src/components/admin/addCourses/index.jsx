import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = ({ setShowModal }) => {
  const [step, setStep] = useState(1); // Track the current step

  const [courseData, setCourseData] = useState({
    course_name: "",
    course_details: "",
    author: "",
    level: "",
    category: "",
    course_img: "",
    author_img: "",
    sections: [],
  });

  const [sectionData, setSectionData] = useState({
    section_name: "",
    section_text: "",
    videos: [{ video_url: "", video_title: "" }],
    quizzes: [
      {
        quiz_title: "",
        questions: [{ question_text: "", options: [""], correct_answer: 0 }],
      },
    ],
  });

  const [courses, setCourses] = useState([]);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setSectionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (index, e) => {
    const { name, value } = e.target;
    const videos = [...sectionData.videos];
    videos[index][name] = value;
    setSectionData((prev) => ({ ...prev, videos }));
  };

  const handleQuizChange = (index, e) => {
    const { name, value } = e.target;
    const quizzes = [...sectionData.quizzes];
    quizzes[index][name] = value;
    setSectionData((prev) => ({ ...prev, quizzes }));
  };

  const handleQuestionChange = (quizIndex, questionIndex, e) => {
    const { name, value } = e.target;
    const quizzes = [...sectionData.quizzes];
    quizzes[quizIndex].questions[questionIndex][name] = value;
    setSectionData((prev) => ({ ...prev, quizzes }));
  };

  const handleAddQuestion = (quizIndex) => {
    const quizzes = [...sectionData.quizzes];
    quizzes[quizIndex].questions.push({
      question_text: "",
      options: [""],
      correct_answer: 0,
    });
    setSectionData((prev) => ({ ...prev, quizzes }));
  };

  const handleRemoveQuestion = (quizIndex, questionIndex) => {
    const quizzes = [...sectionData.quizzes];
    quizzes[quizIndex].questions.splice(questionIndex, 1);
    setSectionData((prev) => ({ ...prev, quizzes }));
  };

  const handleAddOption = (quizIndex, questionIndex) => {
    const quizzes = [...sectionData.quizzes];
    quizzes[quizIndex].questions[questionIndex].options.push("");
    setSectionData((prev) => ({ ...prev, quizzes }));
  };

  const handleRemoveOption = (quizIndex, questionIndex, optionIndex) => {
    const quizzes = [...sectionData.quizzes];
    quizzes[quizIndex].questions[questionIndex].options.splice(optionIndex, 1);
    setSectionData((prev) => ({ ...prev, quizzes }));
  };

  const handleAddSection = () => {
    setCourseData((prev) => ({
      ...prev,
      sections: [...prev.sections, sectionData],
    }));
    setSectionData({
      section_name: "",
      section_text: "",
      videos: [{ video_url: "", video_title: "" }],
      quizzes: [
        {
          quiz_title: "",
          questions: [{ question_text: "", options: [""], correct_answer: 0 }],
        },
      ],
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/courses/addcourse",
        courseData
      );
      setCourses([...courses, response.data]);
      setCourseData({
        course_name: "",
        course_details: "",
        author: "",
        level: "",
        category: "",
        course_img: "",
        author_img: "",
        sections: [],
      });
      console.log(response);
      setShowModal(false);
      alert("Course added successfully!");
    } catch (error) {
      console.error("Error adding course", error);
      alert("An error occurred while adding the course.");
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      const result = await axios.get("http://localhost:5000/api/courses");
      setCourses(result.data);
    };
    fetchCourses();
  }, []);

  ///

  // Step navigation handlers
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
            <input
              name="course_name"
              placeholder="Course Name"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleCourseChange}
              value={courseData.course_name}
            />
            <textarea
              name="course_details"
              placeholder="Course Details"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleCourseChange}
              value={courseData.course_details}
            />
            <input
              name="author"
              placeholder="Author"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleCourseChange}
              value={courseData.author}
            />
            <input
              name="level"
              placeholder="Level"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleCourseChange}
              value={courseData.level}
            />
            <input
              name="category"
              placeholder="Category"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleCourseChange}
              value={courseData.category}
            />
            <input
              name="course_img"
              placeholder="Course Image URL"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleCourseChange}
              value={courseData.course_img}
            />
            <input
              name="author_img"
              placeholder="Author Image URL"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleCourseChange}
              value={courseData.author_img}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold">Add Sections</h3>
            <input
              name="section_name"
              placeholder="Section Name"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleSectionChange}
              value={sectionData.section_name}
            />
            <textarea
              name="section_text"
              placeholder="Section Text"
              className="block w-full p-2 mb-2 border rounded"
              onChange={handleSectionChange}
              value={sectionData.section_text}
            />
            <h4 className="font-semibold mt-2">Videos</h4>
            {sectionData.videos.map((video, index) => (
              <div
                key={index}
                className="flex flex-col mb-2 border rounded p-2 bg-gray-100"
              >
                <input
                  name="video_title"
                  placeholder="Video Title"
                  className="block w-full p-2 mb-2 border rounded"
                  onChange={(e) => handleVideoChange(index, e)}
                  value={video.video_title}
                />
                <input
                  name="video_url"
                  placeholder="Video URL"
                  className="block w-full p-2 mb-2 border rounded"
                  onChange={(e) => handleVideoChange(index, e)}
                  value={video.video_url}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSection}
              className="mt-4 bg-green-500 text-white rounded px-2 py-1"
            >
              Add Section
            </button>
            {/* Add video and quiz form elements here */}
          </div>
        );
      case 3:
        return (
          <div>
            <h4 className="font-semibold mt-2">Quizzes</h4>
            {sectionData.quizzes.map((quiz, quizIndex) => (
              <div
                key={quizIndex}
                className="flex flex-col mb-2 border rounded p-2 bg-gray-100"
              >
                <input
                  name="quiz_title"
                  placeholder="Quiz Title"
                  className="block w-full p-2 mb-2 border rounded"
                  onChange={(e) => handleQuizChange(quizIndex, e)}
                  value={quiz.quiz_title}
                />
                {quiz.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="flex flex-col mb-2 border rounded p-2 bg-gray-200"
                  >
                    <input
                      name="question_text"
                      placeholder="Question Text"
                      className="block w-full p-2 mb-2 border rounded"
                      onChange={(e) =>
                        handleQuestionChange(quizIndex, questionIndex, e)
                      }
                      value={question.question_text}
                    />
                    <h5 className="font-semibold mt-2">Options</h5>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center mb-2">
                        <input
                          name="options"
                          placeholder={`Option ${optIndex + 1}`}
                          className="block w-full p-2 border rounded mr-2"
                          onChange={(e) => {
                            const options = [...question.options];
                            options[optIndex] = e.target.value;
                            setSectionData((prev) => {
                              const quizzes = [...prev.quizzes];
                              quizzes[quizIndex].questions[
                                questionIndex
                              ].options = options;
                              return { ...prev, quizzes };
                            });
                          }}
                          value={option}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveOption(
                              quizIndex,
                              questionIndex,
                              optIndex
                            )
                          }
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(quizIndex, questionIndex)}
                      className="mt-2 bg-blue-500 text-white rounded px-2 py-1"
                    >
                      Add Option
                    </button>
                    <div className="mt-2">
                      <label className="font-semibold">
                        Correct Answer (Index):
                      </label>
                      <input
                        type="number"
                        className="block w-full p-2 border rounded mt-1"
                        value={question.correct_answer}
                        onChange={(e) => {
                          const quizzes = [...sectionData.quizzes];
                          quizzes[quizIndex].questions[
                            questionIndex
                          ].correct_answer = parseInt(e.target.value);
                          setSectionData((prev) => ({ ...prev, quizzes }));
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveQuestion(quizIndex, questionIndex)
                      }
                      className="text-red-500 hover:underline mt-2"
                    >
                      Remove Question
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddQuestion(quizIndex)}
                  className="mt-2 bg-blue-500 text-white rounded px-2 py-1"
                >
                  Add Question
                </button>
              </div>
            ))}
            {/* Add quizzes and options */}
            {/* <h4 className="font-semibold mt-2">Quizzes</h4> */}
            {/* Add quizzes and options inputs similar to your code */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 pt-0 rounded-lg">
      <form
        onSubmit={handleAddCourse}
        className="bg-white p-4 rounded shadow-md"
      >
        {renderStepContent()}

        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-500 text-white rounded px-4 py-2"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-indigo-600 text-white rounded px-4 py-2"
            >
              Add Course
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
