import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all required fields are filled
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all the required fields.');
      setSuccessMessage('');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post(
        'https://lms-backend-ufn7.onrender.com/api/v1/auth/admins/register', // Your API endpoint
        formData
      );
      setSuccessMessage('Admin registered successfully!');
      setError('');
      setFormData({
        name: '',
        email: '',
        password: '',
      });

      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error registering admin:', err.response);
      setError(err.response?.data?.error || 'An error occurred during registration.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 col-span-2">
          Admin Register
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 col-span-2">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4 col-span-2">{successMessage}</p>}
        
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Input */}
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

        {/* Password Input */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 col-span-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default AdminRegisterForm;
