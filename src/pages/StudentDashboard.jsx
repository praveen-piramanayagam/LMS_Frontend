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
      const response = await fetch(`https://lms-backend-ufn7.onrender.com/api/v1/profile/getstudent/${studentId}`);
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

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <NavHome />

      {/* Content below the Navbar */}
      <div className="container mx-auto p-8 mt-[60px]"> {/* Added mt-20 to add space for the navbar */}
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Welcome to Your Dashboard</h1>

        {loading ? (
          <div className="text-center text-xl text-gray-600">Loading your profile...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : student ? (
          <div className="flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-4 w-[65rem] max-w-[65rem]">
              {successMessage && (
                <div className="text-green-500 text-lg font-semibold">{successMessage}</div>
              )}

              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-600">Name:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editableProfile.name || ''}
                        onChange={handleProfileChange}
                        className="border-2 border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-600">Email:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editableProfile.email || ''}
                        onChange={handleProfileChange}
                        className="border-2 border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="studentId" className="block text-gray-600">Student ID:</label>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={editableProfile.studentId || ''}
                        onChange={handleProfileChange}
                        className="border-2 border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div className="flex space-x-8">
                    <p><strong>Name:</strong> {student.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {student.email || 'N/A'}</p>
                    <p><strong>Student ID:</strong> {student.studentId || 'N/A'}</p>
                    <button
                      onClick={handleEditClick}
                      className="bg-yellow-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-300"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">Unable to load profile. Please log in again.</div>
        )}
      </div>
      <TutorFilter/>


      {/* Logout Button at Bottom Right Corner with Fixed Width */}
      <div className="absolute bottom-4 right-4 flex w-auto justify-center">
        <button
          onClick={handleLogout}
          className="w-[80px] h-[50px] bg-red-600 text-white shadow-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
