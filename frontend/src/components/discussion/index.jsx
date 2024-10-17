import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../CustomHooks/authContext"; // Adjust to your path
import { jwtDecode } from "jwt-decode"; // Ensure you import jwt-decode correctly

const Discussion = ({ courseId }) => {
  const { token } = useContext(AuthContext); // Get token from AuthContext
  const [discussions, setDiscussions] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Decode the token to get user info
  const userId = token ? jwtDecode(token).id : null; // Assuming your token contains the userId
  console.log(jwtDecode(token));

  console.log(token);
  console.log(userId);
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}/discussions`
        );
        console.log("Fetched discussions:", response.data);
        setDiscussions(response.data);
      } catch (error) {
        setError("Error fetching discussions");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, [courseId]);

  // Function to handle posting a new discussion message
  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/discussions`,
        {
          userId: userId, // Automatically use the userId from the decoded token
          message: newMessage,
        }
      );

      setDiscussions((prevDiscussions) => [...prevDiscussions, response.data]); // Append the new message to the discussions list
      setNewMessage(""); // Clear the input
    } catch (error) {
      setError("Error posting message");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Discussion</h2>

      {loading ? (
        <p>Loading discussions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="discussion-list mb-1 h-48 overflow-y-auto">
          {discussions.length > 0 ? (
            discussions.map((discussion) => (
              <div
                key={discussion._id}
                className="p-4 mb-2 bg-gray-100 rounded"
              >
                <p>{discussion.message}</p>
                <small>Posted by User {discussion.userId}</small>
              </div>
            ))
          ) : (
            <p>No discussions yet. Be the first to post!</p>
          )}
        </div>
      )}

      <form onSubmit={handlePostMessage}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 mb-1 border border-gray-300 rounded"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post Message
        </button>
      </form>
    </div>
  );
};

export default Discussion;
