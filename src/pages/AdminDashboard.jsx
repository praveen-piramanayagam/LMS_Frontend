import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as jwtDecode from 'jwt-decode';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutorSearch, setTutorSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [adminProfileEdit, setAdminProfileEdit] = useState({
    name: '',
    email: ''
  });

  const verifyAdmin = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Unauthorized: No token found');

      const decodedToken = jwtDecode.default(token);  // Access the default export function
      const adminId = decodedToken.adminId;

      if (typeof adminId !== 'string') throw new Error('Unauthorized: Invalid token (adminId is not a string)');

      const response = await axios.get(`http://localhost:3001/api/v1/profile/getadmin/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminProfile(response.data);
      setAdminProfileEdit({
        name: response.data.name,
        email: response.data.email,
      });
    } catch (err) {
      console.error('Authentication failed:', err);
      setError('Unauthorized access. Redirecting to login.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const [tutorsResponse, studentsResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/v1/profile/getalltutors', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:3001/api/v1/profile/getallstudents', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setTutors(tutorsResponse.data);
      setStudents(studentsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id, type, currentStatus) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const updatedStatus = !currentStatus;
      const statusData = {
        status: updatedStatus,
      };

      await axios.put(`http://localhost:3001/api/v1/profile/deactivate${type}/${id}`,
        statusData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (type === 'tutor') {
        setTutors(tutors.map(tutor => tutor.tutorId === id ? { ...tutor, isActive: updatedStatus } : tutor));
      } else if (type === 'student') {
        setStudents(students.map(student => student.studentId === id ? { ...student, isActive: updatedStatus } : student));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleProfileEditChange = (e) => {
    const { name, value } = e.target;
    setAdminProfileEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.put(
        `http://localhost:3001/api/v1/profile/updateadmin/${adminProfile.adminId}`,
        adminProfileEdit,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdminProfile(response.data);
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    verifyAdmin();
    fetchData();
  }, []);

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(tutorSearch.toLowerCase())
  );

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="admin-dashboard mx-auto max-w-7xl mt-[6rem] relative">
      {/* Admin Profile Section */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Admin Profile</h2>
        <div className="flex justify-between items-end mt-4">
          {isEditing ? (
            <div className="flex flex-col w-full md:w-1/2">
              <input
                type="text"
                name="name"
                value={adminProfileEdit.name}
                onChange={handleProfileEditChange}
                className="p-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={adminProfileEdit.email}
                onChange={handleProfileEditChange}
                className="p-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Email"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleProfileSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-1/2">
              <p className="text-lg text-gray-800">{adminProfile.name}</p>
              <p className="text-lg text-gray-600">{adminProfile.email}</p>
              <p className="text-lg text-gray-600">Admin ID: {adminProfile.adminId}</p>
            </div>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Logout Button - Positioned at top right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Tutors and Students Sections - Displayed Side by Side */}
      <div className="flex justify-between mt-6">
        {/* Tutors Section */}
        <div className="w-1/2 mr-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tutors</h2>
          <input
            type="text"
            value={tutorSearch}
            onChange={(e) => setTutorSearch(e.target.value)}
            placeholder="Search tutors by name"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="grid grid-cols-1 gap-6">
            {filteredTutors.map((tutor) => (
              <div key={tutor.tutorId} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-lg text-gray-800">{tutor.name}</h3>
                <p className="text-sm text-gray-600">{tutor.email}</p>
                <p
                  className={`mt-2 text-sm font-semibold ${tutor.isActive ? 'text-green-500' : 'text-red-500'}`}
                >
                  {tutor.isActive ? 'Active' : 'Inactive'}
                </p>
                <button
                  onClick={() => toggleStatus(tutor.tutorId, 'tutor', tutor.isActive)}
                  className="mt-4 text-white py-2 px-4 rounded-md bg-yellow-500 hover:bg-yellow-700 transition-all"
                >
                  Activate/Deactivate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Students Section */}
        <div className="w-1/2 ml-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Students</h2>
          <input
            type="text"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            placeholder="Search students by name"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="grid grid-cols-1 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.studentId} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-lg text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
                <p
                  className={`mt-2 text-sm font-semibold ${student.isActive ? 'text-green-500' : 'text-red-500'}`}
                >
                  {student.isActive ? 'Active' : 'Inactive'}
                </p>
                <button
                  onClick={() => toggleStatus(student.studentId, 'student', student.isActive)}
                  className="mt-4 text-white py-2 px-4 rounded-md bg-yellow-500 hover:bg-yellow-700 transition-all"
                >
Activate/Deactivate                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
