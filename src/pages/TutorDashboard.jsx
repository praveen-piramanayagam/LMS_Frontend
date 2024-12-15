import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TutorDashboard = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [lessonToUpdate, setLessonToUpdate] = useState(null);
    const [newLesson, setNewLesson] = useState({
        title: '',
        description: '',
        subject: '',
        duration: '',
        price: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('sessionToken'); // Retrieve the token using the correct key
        console.log('Token retrieved from sessionStorage:', token);

        if (!token) {
            console.error('No token found. Redirecting to login.');
            navigate('/login');
            return;
        }

        const decoded = decodeJWT(token);
        if (!decoded || !decoded.tutorId) {
            console.error('Invalid token or missing tutorId:', decoded);
            navigate('/login');
            return;
        }

        if (isTokenExpired(decoded)) {
            console.error('Token expired. Redirecting to login.');
            navigate('/login');
            return;
        }

        console.log('Decoded Token:', decoded);

        fetchLessons(decoded.tutorId, token);
    }, [navigate]);

    // Decode JWT function
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    // Check token expiration
    const isTokenExpired = (decodedToken) => {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return decodedToken.exp < currentTime; // Compare expiration time
    };

    // Fetch lessons created by the tutor
    const fetchLessons = async (tutorId, token) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3001/api/v1/lessons/getcreatedlessons/${tutorId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Fetched lessons:', response.data); // Debug the lesson data
            setLessons(response.data);
            setLoading(false);
        } catch (error) {
            console.error("API Error:", error.response ? error.response.data : error.message);
            setError("Failed to fetch lessons. Please try again later.");
            setLoading(false);
        }
    };

    // Logout function
    const handleLogout = () => {
        sessionStorage.removeItem('sessionToken');
        navigate('/login');
    };

   // Handle Create Lesson Button Click
const handleCreateLesson = () => {
  setShowModal(true); // Open the modal
};

// Handle form field changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewLesson((prevState) => ({
      ...prevState,
      [name]: value
  }));
};

// Handle saving the new lesson
const handleSaveLesson = async () => {
  const token = sessionStorage.getItem('sessionToken');
  const decoded = decodeJWT(token);

  try {
      await axios.post(
          'http://localhost:3001/api/v1/lessons/createlesson',
          {
              tutorId: decoded.tutorId,
              title: newLesson.title,
              description: newLesson.description,
              subject: newLesson.subject,
              duration: newLesson.duration,
              price: newLesson.price,
          },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      // Close the modal and reset form fields
      setShowModal(false);
      setNewLesson({
          title: '',
          description: '',
          subject: '',
          duration: '',
          price: ''
      });
      // Refresh lessons
      fetchLessons(decoded.tutorId, token);
  } catch (error) {
      console.error("Error saving lesson:", error);
      setError("Failed to save lesson. Please try again.");
  }
};


// Handle lesson update
const handleUpdateLesson = (lesson) => {
  console.log('Selected lesson to update:', lesson);
  setLessonToUpdate(lesson);  // Set the lesson data to update
  setShowUpdateModal(true);  // Show the modal for updating
};    

const handleUpdateInputChange = (e) => {
  const { name, value } = e.target;
  setLessonToUpdate((prev) => ({
    ...prev,
    [name]: value,  // Dynamically update the corresponding field
  }));
};

const handleUpdateSave = async () => {
  if (!lessonToUpdate || !lessonToUpdate.lesson_id) {
    console.log('lessonToUpdate:', lessonToUpdate); // Debugging log
    console.error('lesson_id is missing');
    return;  // Don't proceed if lesson_id is missing
  }

  const token = sessionStorage.getItem('sessionToken');
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    console.log('Updating lesson with data:', lessonToUpdate);

    const response = await axios.put(
      `http://localhost:3001/api/v1/lessons/updatelesson/${lessonToUpdate.lesson_id}`,
      { 
          title: lessonToUpdate.title,
          description: lessonToUpdate.description,
          subject: lessonToUpdate.subject,
          duration: lessonToUpdate.duration,
          price: lessonToUpdate.price
      },
      {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      }
  );
  

    if (!response.data.updatedLesson) {
      throw new Error('Failed to update the lesson');
    }

    console.log('Updated lesson:', response.data.updatedLesson);

    // Update the lessons list with the new data
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.lesson_id === response.data.updatedLesson.lesson_id
          ? response.data.updatedLesson
          : lesson
      )
    );

    setShowUpdateModal(false);
    setLessonToUpdate(null);
  } catch (error) {
    console.error('Error updating lesson:', error);
    setError('Failed to update lesson');
  }
};


   // Handle lesson delete
const handleDeleteLesson = async (lessonId) => {
  const confirmation = window.confirm("Are you sure you want to delete this lesson?");
  if (!confirmation) {
      return; // Exit the function if the user cancels
  }

  const token = sessionStorage.getItem('sessionToken');
  const decoded = decodeJWT(token);

  try {
      await axios.delete(
          `http://localhost:3001/api/v1/lessons/deletelesson/${lessonId}`,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      // Refresh lessons after deletion
      fetchLessons(decoded.tutorId, token);
  } catch (error) {
      console.error("Error deleting lesson:", error);
      setError("Failed to delete lesson. Please try again.");
  }
};


    return (
      <div className="container mx-auto p-8 mt-14 relative">
      <div className="flex justify-between items-center absolute top-[4rem] w-[95%]">
          <h1 className="text-4xl font-semibold text-center text-gray-800">
              Tutor Dashboard
          </h1>
          <div className="flex gap-4">
              <button
                  onClick={handleCreateLesson}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                  Create Lesson
              </button>
              <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                  Logout
              </button>
          </div>
      </div>
  
      {loading ? (
          <div className="text-center text-xl text-gray-600">Loading lessons...</div>
      ) : error ? (
          <div className="text-center text-red-500">{error}</div>
      ) : (
          <div>
              <h2 className="text-2xl font-semibold mb-4">Lessons Created by You</h2>
              {lessons.length === 0 ? (
                  <p className="text-gray-700">You have not created any lessons yet.</p>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-[5rem]">
                      {lessons.map((lesson) => (
                          <div key={lesson.lesson_id} className="bg-white p-4 rounded-lg shadow">
                              <h3 className="text-lg font-semibold">{lesson.title}</h3>
                              <p className="text-gray-600">{lesson.description}</p>
                              <p className="text-gray-600">Subject: {lesson.subject}</p>
                              <p className="text-gray-600">Duration: {lesson.duration} minutes</p>
                              <p className="text-gray-600">Price: ₹{lesson.price}</p>
                              <p>Lesson ID: {lesson.lesson_id}</p>
                              <div className="flex gap-2 mt-4">
                                  <button
                                      onClick={() => handleUpdateLesson(lesson)}
                                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                  >
                                      Update
                                  </button>
                                  <button
                                      onClick={() => handleDeleteLesson(lesson.lesson_id)}
                                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                  >
                                      Delete
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      )}
      {/* Create Lesson Modal */}
    {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-2xl font-semibold mb-4">Create a New Lesson</h2>
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newLesson.title}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newLesson.description}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={newLesson.subject}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="number"
                        name="duration"
                        placeholder="Duration (in minutes)"
                        value={newLesson.duration}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price (₹)"
                        value={newLesson.price}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveLesson}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )}
    {/* Update Lesson Modal */}
    {showUpdateModal && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4">Update Lesson</h2>
            <div className="flex flex-col gap-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={lessonToUpdate?.title || ""}
                    onChange={handleUpdateInputChange}
                    className="border rounded p-2"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={lessonToUpdate?.description || ""}
                    onChange={handleUpdateInputChange}
                    className="border rounded p-2"
                />
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={lessonToUpdate?.subject || ""}
                    onChange={handleUpdateInputChange}
                    className="border rounded p-2"
                />
                <input
                    type="number"
                    name="duration"
                    placeholder="Duration (in minutes)"
                    value={lessonToUpdate?.duration || ""}
                    onChange={handleUpdateInputChange}
                    className="border rounded p-2"
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price (₹)"
                    value={lessonToUpdate?.price || ""}
                    onChange={handleUpdateInputChange}
                    className="border rounded p-2"
                />
            </div>
            <div className="flex justify-end gap-4 mt-4">
                <button
                    onClick={() => setShowUpdateModal(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpdateSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Update
                </button>
            </div>
        </div>
    </div>
)}


  </div>
  
    );
};

export default TutorDashboard;
