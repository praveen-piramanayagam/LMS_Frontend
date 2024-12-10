import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const TutorRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    experience: '',
    qualifications: '',
    expertise: '',
    subjects: '',
    availability: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.experience || !formData.qualifications || !formData.expertise || !formData.subjects || !formData.availability) {
      setError('Please fill in all the required fields.');
      setSuccessMessage('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setSuccessMessage('');
      return;
    }

    const expertiseArray = formData.expertise.split(',').map(item => item.trim()).filter(item => item);
    const subjectsArray = formData.subjects.split(',').map(item => item.trim()).filter(item => item);
    const availabilityArray = formData.availability.split(',').map(item => item.trim()).filter(item => item);

    if (expertiseArray.length === 0 || subjectsArray.length === 0 || availabilityArray.length === 0) {
      setError('Please provide at least one expertise, subject, and availability day.');
      setSuccessMessage('');
      return;
    }

    const payload = {
      ...formData,
      expertise: expertiseArray,
      subjects: subjectsArray,
      availability: availabilityArray,
    };

    try {
      const response = await axios.post('https://lms-backend-ufn7.onrender.com/api/v1/auth/tutors/register', payload);
      setSuccessMessage('Tutor registered successfully!');
      setError('');
      setFormData({
        name: '',
        email: '',
        password: '',
        experience: '',
        qualifications: '',
        expertise: '',
        subjects: '',
        availability: '',
      });

      // Navigate to login page after successful registration
      setTimeout(()=>{
      navigate('/login');
      },3000);

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-6 sm:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 col-span-2">Tutor Registration</h2>

        {error && <p className="text-red-500 text-sm mb-4 col-span-2">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4 col-span-2">{successMessage}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Experience (in years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Qualifications</label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Expertise (comma-separated)</label>
          <input
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Subjects (comma-separated)</label>
          <input
            type="text"
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Availability (comma-separated)</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-200 col-span-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default TutorRegisterForm;
