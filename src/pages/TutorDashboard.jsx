import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TutorOrders from '../components/TutorOrders';

const TutorDashboard = () => {
    const [tutor, setTutor] = useState(null);
    const [editableTutor, setEditableTutor] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState(""); // Success message for profile update
    const [errorMessage, setErrorMessage] = useState("");
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [lessonToUpdate, setLessonToUpdate] = useState(null);
    const [orders, setOrders] = useState([]); // Tutor's orders
    const [orderModalVisible, setOrderModalVisible] = useState(false); // Order modal visibility
    const [newLesson, setNewLesson] = useState({
        title: '',
        description: '',
        subject: '',
        duration: '',
        price: ''
    });
    const navigate = useNavigate();

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
        fetchTutorProfile(decoded.tutorId, token);
        fetchOrders(decoded.tutorId, token);

    }, [navigate]);

    

    // Fetch lessons created by the tutor
    const fetchLessons = async (tutorId, token) => {
      
        try {
                const response = await axios.get(
                    `https://lms-backend-ufn7.onrender.com/api/v1/lessons/getcreatedlessons/${tutorId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            if (response.data && response.data.length > 0) {
                setLessons(response.data); // Assuming you have a state like `lessons`
            } else {
                setLessons([]); // Set empty lessons array
            }
        } catch (error) {
            console.error("Failed to fetch lessons:", error);
            setLessons([]); // Fallback to empty state
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
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Regex for DD-MM-YYYY format
        if (!dateRegex.test(newLesson.scheduledClass)) {
            alert("Invalid date format! Please use DD-MM-YYYY.");
            return;
        }

        // Reformat date from DD-MM-YYYY to DD/MM/YYYY for the backend
        const [day, month, year] = newLesson.scheduledClass.split('-');
        const formattedDate = `${day}/${month}/${year}`;


        try {
            await axios.post(
                'https://lms-backend-ufn7.onrender.com/api/v1/lessons/createlesson',
                {
                    tutorId: decoded.tutorId,
                    title: newLesson.title,
                    description: newLesson.description,
                    subject: newLesson.subject,
                    duration: newLesson.duration,
                    price: newLesson.price,
                    scheduledClass: formattedDate,

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
                `https://lms-backend-ufn7.onrender.com/api/v1/lessons/updatelesson/${lessonToUpdate.lesson_id}`,
                {
                    title: lessonToUpdate.title,
                    description: lessonToUpdate.description,
                    subject: lessonToUpdate.subject,
                    duration: lessonToUpdate.duration,
                    price: lessonToUpdate.price,
                    // scheduledClass: formattedDate,
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
                `https://lms-backend-ufn7.onrender.com/api/v1/lessons/deletelesson/${lessonId}`,
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

    // Fetch tutor profile
    const fetchTutorProfile = async (tutorId, token) => {
        try {
            const response = await axios.get(
                `https://lms-backend-ufn7.onrender.com/api/v1/profile/gettutor/${tutorId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Fetched tutor profile:", response.data); // Log response data
            setTutor(response.data); // Update tutor state
            setEditableTutor(response.data); // Set editable tutor state
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tutor profile:", error);
            setError("Failed to load tutor profile.");
            setLoading(false);
        }
    };

    // Handle profile changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setEditableTutor((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };


    // Save updated profile
    const handleSaveProfile = async () => {
        const token = sessionStorage.getItem("sessionToken");
        try {
            const response = await axios.put(
                `https://lms-backend-ufn7.onrender.com/api/v1/profile/updatetutor/${editableTutor.tutorId}`, // Use _id
                editableTutor,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTutor(response.data); // Update tutor state with new data
            setIsEditing(false);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(""), 2000); // Clear success message after 5 seconds
            window.location.reload();
        } catch (error) {
            console.error("Error saving tutor profile:", error);
            setErrorMessage("Failed to save profile. Please try again.");
        }
    };

    //order
    const fetchOrders = async (tutorId, token) => {
        try {
            console.log("Fetching orders for tutorId:", tutorId);
            const response = await axios.get(
                `https://lms-backend-ufn7.onrender.com/api/v1/order/tutororderdetails/${tutorId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            console.log("API Response:", response.data); // Check if response.data contains 'orders'
            
            if (response.data && response.data.orders) {
                setOrders(response.data.orders);
                console.log("Orders set in state:", response.data.orders); // Verify orders are set
            } else {
                console.log("No orders found in response");
                setOrders([]); // Empty array fallback
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrders([]); // Handle errors gracefully
        }
    };
    

    // const handleOrdersClick = () => {
    //     fetchOrders();
    //     setOrderModalVisible(true);
    // };
    const handleOrdersClick = () => {
        const token = sessionStorage.getItem('sessionToken');
        const decoded = decodeJWT(token);
        if (decoded?.tutorId) {
            fetchOrders(decoded.tutorId, token);
            setOrderModalVisible(true);
        } else {
            console.error("Unable to fetch orders: tutorId is missing");
        }
    };
    

    const closeOrderModal = () => {
        setOrderModalVisible(false);
        window.location.reload();
    };
    const totalEarned = orders.reduce((sum, order) => sum + order.amount, 0);
    const formatScheduledClass = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
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
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                        Create Lesson
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                        Logout
                    </button>
                    <button onClick={handleOrdersClick}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                        Solded lessons
                    </button>
                </div>
            </div>
            {/* Profile Section */}
            <div className="mt-[6rem] bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
                {loading ? (
                    <div className="text-gray-600">Loading profile...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : tutor ? (
                    <>
                        <div>
                            {successMessage && (
                                <div className="text-green-500 mb-4">{successMessage}</div>
                            )}
                            {errorMessage && (
                                <div className="text-red-500 mb-4">{errorMessage}</div>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-gray-600">
                                        Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={editableTutor.name || ""}
                                        onChange={handleProfileChange}
                                        className="border rounded p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-600">
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={editableTutor.email || ""}
                                        onChange={handleProfileChange}
                                        className="border rounded p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="_id" className="block text-gray-600">
                                        Tutor ID:
                                    </label>
                                    <input
                                        type="text"
                                        id="tutorId" // Use _id here
                                        name="tutorId"
                                        value={editableTutor.tutorId || ""}
                                        readOnly
                                        className="border rounded p-2 w-full bg-gray-200"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveProfile}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    Save Profile
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p>
                                    <strong>Name:</strong> {tutor?.name || "N/A"}
                                </p>
                                <p>
                                    <strong>Email:</strong> {tutor?.email || "N/A"}
                                </p>
                                <p>
                                    <strong>Tutor ID:</strong> {tutor?.tutorId || "N/A"} {/* Use _id */}
                                </p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300 mt-[1rem]"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-red-500">Failed to load profile.</div>
                )}
            </div>



            {loading ? (
                <div className="text-center text-xl text-gray-600">Loading lessons...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div>
                    <h2 className="text-2xl font-semibold mb-2 mt-5">Lessons Created by You</h2>

                    {lessons.length === 0 ? (
                        <p className="text-gray-700">You have not created any lessons yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-[rem]">
                            {lessons.map((lesson) => (
                                <div key={lesson.lesson_id} className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                                    <p className="text-gray-600">{lesson.description}</p>
                                    <p className="text-gray-600">Subject: {lesson.subject}</p>
                                    <p className="text-gray-600">Duration: {lesson.duration} minutes</p>
                                    <p className="text-gray-600">Price: ₹{lesson.price}</p>
                                    <p className="text-gray-600">Meeting url: {lesson.meetingLink}</p>
                                    <p className="text-gray-600">ScheduledClass at: {formatScheduledClass(lesson.scheduledClass)}</p>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleUpdateLesson(lesson)}
                                            className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500"
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
                            <input
                                type="text"
                                name="scheduledClass"
                                placeholder="DD-MM-YYYY"
                                value={newLesson.scheduledClass}
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
                            {/* <input
                                type="text"
                                name="scheduledClass"
                                placeholder="DD-MM-YYYY"
                                value={lessonToUpdate?.scheduledClass || ""}
                                onChange={handleUpdateInputChange}
                                className="border rounded p-2"
                            /> */}
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
            {/* Orders Modal */}
            {orderModalVisible && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
                        <h2 className="text-2xl font-semibold mb-4">Tutor Orders</h2>

                        {orders.length > 0 ? (
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Order ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Title</th>
                                        <th className="border border-gray-300 px-4 py-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.order_id}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {order.order_id}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {order.title}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                ₹{order.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-700">No orders found for this tutor.</p>
                        )}

                        {/* Display Total Earned */}
                        <div className="text-right mt-4">
                            <p className="text-lg font-semibold">
                                Total Earned: <span className="text-green-600">₹{totalEarned}</span>
                            </p>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeOrderModal}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!orderModalVisible && orders.length === 0 && (
                <p className="text-center text-gray-700 mt-4">No orders found.</p>
            )}



        </div>


    );
};

export default TutorDashboard;