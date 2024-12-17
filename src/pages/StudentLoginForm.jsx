import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post(
        'https://lms-backend-ufn7.onrender.com/api/v1/auth/students/login',
        formData
      );

      const token = response.data.token;
      if (!token) {
        setError('No token received.');
        setSuccessMessage('');
        return;
      }

      sessionStorage.setItem('token', token); // Store token in sessionStorage

      if (!response.data.isActive) {
        setError('Your account is inactive. Please contact support.');
        sessionStorage.removeItem('token'); // Remove token if account is inactive
        setSuccessMessage('');
        return;
      }

      setSuccessMessage('Login successful!');
      setError('');

      setTimeout(() => {
        navigate('/studentdashboard');
      }, 2000);
    } catch (err) {
      console.error('Error logging in:', err.response);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      setSuccessMessage('');
    }
  };



  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Student Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>

  );
};

export default StudentLoginForm;
