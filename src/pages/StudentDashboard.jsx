import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHome from '../components/NavHome';
import TutorFilter from '../components/TutorFilter';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // Success message after update
  const [orders, setOrders] = useState([]); // Tutor's orders
    const [orderModalVisible, setOrderModalVisible] = useState(false); // Order modal visibility

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = decodeJWT(token);
      console.log('Decoded Token:', decoded);

      const studentId = decoded.studentId;
      if (studentId) {
        fetchStudentProfile(studentId);
      } else {
        setError('Student ID not found in the token');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/login');
    }



  }, [navigate]);

  const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const fetchStudentProfile = async (studentId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/profile/getstudent/${studentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student profile');
      }
      const data = await response.json();
      setStudent(data);
      setEditableProfile(data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      setError('Failed to load student profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    const studentId = editableProfile.studentId;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/profile/updatestudent/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to update student profile');
      }

      const updatedProfile = await response.json();
      // Update both `student` and `editableProfile` states with the updated profile
      setStudent(updatedProfile);
      setEditableProfile(updatedProfile); // Ensure editableProfile is also updated with the latest data
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile');
    }
  };

  const fetchOrders = async () => {
    
    try {
      const token = sessionStorage.getItem('token');
      const studentId = student.studentId; // Use student data from state
  
      if (!studentId) {
        setError('Student ID not found.');
        return;
      }
      const response = await fetch(
        `http://localhost:3001/api/v1/order/studentsorderdetails/${studentId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }
  
      const data = await response.json();
      setOrders(data.orders || []); // Update orders state
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Failed to load orders.');
    }
  };

  const handleOrdersClick = () => {
    fetchOrders();
    setOrderModalVisible(true);
  };

  const closeOrderModal = () => {
    setOrderModalVisible(false);
    window.location.reload();
  };
  // Format scheduledClass to display only date and day
  // Function to format the scheduledClass to "Day, Date" format
const formatScheduledClass = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};



  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <NavHome />

      {/* Main Container */}
      <div className="container mx-auto p-8 mt-[4rem]">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Student Dashboard</h1>

        {orderModalVisible && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[99%]">
              <h2 className="text-2xl font-semibold mb-4">Purchased Lessons</h2>
              {orders.length === 0 ? (
                <p className="text-gray-600">No orders found for this student.</p>
              ) : (
                <table className="table-auto w-full text-left border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Order ID</th>
                      <th className="border border-gray-300 px-4 py-2">Title</th>
                      <th className="border border-gray-300 px-4 py-2">Amount</th>
                      <th className="border border-gray-300 px-4 py-2">Meeting Link</th>
                      <th className="border border-gray-300 px-4 py-2">Scheduled Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{order.order_id}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.title}</td>
                        <td className="border border-gray-300 px-4 py-2">₹{order.amount}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.meetingLink}</td>
                        <td className="border border-gray-300 px-4 py-2">{formatScheduledClass(order.scheduledClass)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeOrderModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-xl text-gray-600">Loading your profile...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : student ? (
          <div className="flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-[65rem]">
              {successMessage && (
                <div className="text-green-500 text-lg font-semibold mb-4">{successMessage}</div>
              )}

              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editableProfile.name || ''}
                        onChange={handleProfileChange}
                        className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editableProfile.email || ''}
                        onChange={handleProfileChange}
                        className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="studentId" className="block text-gray-700 font-medium">Student ID</label>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={editableProfile.studentId || ''}
                        onChange={handleProfileChange}
                        className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <button
                      onClick={handleSave}
                      className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-700"><strong>Name:</strong> {student.name || 'N/A'}</p>
                      <button
                        onClick={handleEditClick}
                        className="bg-yellow-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-300"
                      >
                        Edit Profile
                      </button>
                    </div>
                    <p className="text-lg font-medium text-gray-700"><strong>Email:</strong> {student.email || 'N/A'}</p>
                    <p className="text-lg font-medium text-gray-700"><strong>Student ID:</strong> {student.studentId || 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">Unable to load profile. Please log in again.</div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4">
        <button
          onClick={handleOrdersClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          View Purchased Lessons
        </button>
        <button
          onClick={handleLogout}
          className="w-[120px] py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>

      <TutorFilter />
    </div>
  );
};

export default StudentDashboard;
