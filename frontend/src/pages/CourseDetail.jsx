import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Modal, Button, Radio, message } from "antd";
import Accordion from "../components/Accordion";
import { getCoursesById } from "../features/getCourses";
import Discussion from "../components/discussion"; // Import your discussion component
import ReactPlayer from "react-player";
import { AuthContext } from "../CustomHooks/authContext"; // Adjust to your path
import { jwtDecode } from "jwt-decode";

const { TabPane } = Tabs;

function CourseDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  // const [selectedOption, setSelectedOption] = useState(null); // Track the selected answer
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null); // Track currently playing video
  const [quizzes, setQuizzes] = useState([]); // Track quizzes for the current section
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set()); // Track completed quizzes
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null); // Track the quiz to be taken
  const userId = token ? jwtDecode(token).id : null;
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await getCoursesById(id);
        console.log("Fetched course data:", res); // Log the fetched course data
        setCourse(res);
      } catch (error) {
        console.error("Error fetching course data:", error); // Log any error
      }
    };

    fetchCourseData();
  }, [id]);

  // Open Feedback Modal
  const showFeedbackModal = () => {
    setIsFeedbackModalVisible(true);
  };

  // Close modals
  const handleCancel = () => {
    setIsFeedbackModalVisible(false);
    setIsQuizModalVisible(false); // Close quiz modal too
    setActiveQuiz(null); // Reset active quiz
  };

  const handleOptionChange = (e, questionIndex) => {
    const newSelectedOptions = { ...selectedOptions };
    newSelectedOptions[questionIndex] = e.target.value; // Store the selected option for the question
    setSelectedOptions(newSelectedOptions);
  };
  // const handleOptionChange = (e) => {
  //   setSelectedOption(e.target.value); // Update the selected answer
  // };

  // Handle video end to show quizzes
  // const handleVideoEnd = (quizIds) => {
  //   setQuizzes(quizIds); // Set quizzes to display
  // };

  // Open quiz modal
  const handleQuizButtonClick = (quiz) => {
    if (completedQuizzes.has(quiz._id)) {
      message.warning("you have already submitted this quiz");
      return;
    }
    console.log("Selected Quiz:", quiz); // Check the selected quiz data
    setActiveQuiz(quiz);
    setIsQuizModalVisible(true);
  };

  // Handle quiz submission

  const handleQuizSubmit = async () => {
    if (activeQuiz) {
      let score = 0;

      activeQuiz.quiz_ids.forEach((quiz) => {
        quiz.questions.forEach((question, index) => {
          const userAnswerIndex = selectedOptions[index];
          if (userAnswerIndex === question.correct_answer) {
            score += 1; // Increment score for correct answer
          }
        });
      });

      // Assuming you want to track time spent on the quiz
      const timeSpent = 30; // Replace this with the actual time spent logic

      // Post the score to the backend
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/engagements`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              courseId: id, // Assuming course._id is available
              score: score,
              timeSpent: timeSpent,
            }),
          }
        );

        if (response.ok) {
          console.log("Score submitted successfully:", score);
          // setCompletedQuizzes((prev) => new Set(prev).add(activeQuiz._id));
          setCompletedQuizzes((prev) => {
            const updatedcompletedQuizzes = new Set(prev).add(activeQuiz._id);
            localStorage.setItem(
              `completedQuizzes-${userId}`,
              JSON.stringify([...updatedcompletedQuizzes])
            );
            return updatedcompletedQuizzes;
          });
          handleCancel();
        } else {
          console.error("Failed to submit score");
        }
      } catch (error) {
        console.error("Error posting score:", error);
      }
    }
  };
  // const handleQuizSubmit = () => {
  //   if (activeQuiz) {
  //     setCompletedQuizzes((prev) => new Set(prev).add(activeQuiz._id)); // Mark quiz as completed
  //     handleCancel(); // Close modal after submission
  //   }
  // };

  const renderMediaContent = (section) => {
    if (section?.video_ids?.length > 0) {
      return section.video_ids.map((videoId, index) => {
        const video = videoId;
        if (video) {
          return (
            <div key={index} className="mt-4">
              <h4>{video.video_title}</h4>
              <ReactPlayer
                url={video.video_url}
                controls
                onPlay={() => setActiveVideo(video)} // Track active video
              />
              {/* Handle quizzes */}
              {section.quiz_ids && section.quiz_ids.length > 0 && (
                <div className="mt-2">
                  {section.quiz_ids.map((quizId) => {
                    // Get the quiz for this section
                    const quiz = course?.sections.find((s) =>
                      s.quiz_ids.find((q) => q._id === quizId._id)
                    );
                    if (!quiz) return <p key={quizId}>Quiz not found.</p>;

                    return (
                      <div key={quizId._id}>
                        {completedQuizzes.has(quizId._id) ? (
                          <p>You have already completed this quiz.</p>
                        ) : (
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out"
                            onClick={() => handleQuizButtonClick(quiz)}
                          >
                            Start Quiz
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        } else {
          return <p key={index}>Video not found</p>;
        }
      });
    } else if (section?.docs?.length > 0) {
      return section.docs.map((doc, index) => (
        <div key={index} className="mt-4">
          <h4>{doc.doc_title}</h4>
          <iframe
            src={doc.doc_url}
            width="100%"
            height="500px"
            frameBorder="0"
            title={doc.doc_title}
          ></iframe>
        </div>
      ));
    } else {
      return <p>No media content available for this section.</p>;
    }
  };

  return (
    <div className="mt-4 ml-4 bg-white h-[calc(100%-2.5rem)] rounded-lg">
      <div className="bg-orange-400 rounded-lg text-gray-200">
        <div className="container px-5 py-2 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="title-font font-medium text-2xl text-gray-100">
              {course?.course_name}
            </h1>
            <p className="leading-relaxed mt-4 text-sm">
              {course?.course_details}
            </p>
          </div>
        </div>
      </div>

      <div className="container px-5 py-4 mx-auto">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Course Content" key="1">
            <div className="h-96 overflow-y-auto">
              <h1 className="title-font font-medium text-xl pb-2">Syllabus</h1>
              {course?.sections ? (
                <>
                  <Accordion items={course.sections} />
                  {course.sections.map((section, index) => {
                    return renderMediaContent(section);
                  })}
                </>
              ) : (
                <p>No content available</p>
              )}
            </div>
          </TabPane>

          <TabPane tab="Discussions" key="2">
            <Discussion courseId={id} />
          </TabPane>

          <TabPane tab="Feedback" key="3">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter subject"
                />
              </div>

              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700"
                >
                  Body
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter feedback"
                />
              </div>

              <div>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                  type="default"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    // Add your feedback submission logic here
                    console.log("Feedback submitted");
                  }}
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </TabPane>
        </Tabs>

        {/* Quiz Modal */}
        <Modal
          title={activeQuiz?.quiz_title}
          open={isQuizModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          {activeQuiz && activeQuiz.quiz_ids && activeQuiz.quiz_ids[0] ? (
            <div>
              {activeQuiz.quiz_ids[0].questions.map(
                (question, questionIndex) => (
                  <div key={question._id} className="mb-4">
                    <h3>{`Q${questionIndex + 1}: ${
                      question.question_text
                    }`}</h3>

                    {question.options && question.options.length > 0 ? (
                      <Radio.Group
                        onChange={(e) => handleOptionChange(e, questionIndex)}
                        value={selectedOptions[questionIndex] || null}
                      >
                        {question.options.map((option, optionIndex) => (
                          <Radio key={optionIndex} value={optionIndex}>
                            {option}
                          </Radio>
                        ))}
                      </Radio.Group>
                    ) : (
                      <p>No options available for this question</p>
                    )}
                  </div>
                )
              )}

              <div className="mt-4">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out"
                  onClick={handleQuizSubmit}
                >
                  Submit Quiz
                </Button>
              </div>
            </div>
          ) : (
            <p>No quiz data available.</p>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default CourseDetail;
