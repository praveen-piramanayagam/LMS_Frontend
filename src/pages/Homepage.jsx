import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token (you can use sessionStorage or localStorage based on your preference)
    localStorage.removeItem('token');
    
    // Redirect to login page after logout
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
      
      <div className="flex justify-center items-center min-h-screen text-gray-800">
        <h1 className="text-4xl font-bold">Welcome to the Homepage!</h1>
      </div>
    </div>
  );
};

export default Homepage;
