import React from 'react';
import { Link } from 'react-router-dom';

const Registerpage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full max-w-4xl">
        {/* Student Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-teal-500 text-white flex items-center justify-center rounded-full mb-4">
            <span className="text-2xl font-bold">S</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Student</h3>
          <Link to="/registerstudent" className="text-blue-500 hover:underline"><button className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-200 font-semibold">
          Register
          </button></Link>
        </div>

        {/* Tutor Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-500 text-white flex items-center justify-center rounded-full mb-4">
            <span className="text-2xl font-bold">T</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tutor</h3>
          <Link to="/registertutor" className="hover:text-gray-300"><button className="w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200 font-semibold">
            Register
          </button></Link>
        </div>

        {/* Admin Card */}
        {/* <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-500 text-white flex items-center justify-center rounded-full mb-4">
            <span className="text-2xl font-bold">A</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin</h3>
          <Link to="/registeradmin" className="hover:text-gray-300"><button className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200 font-semibold">
            Register
          </button></Link>
        </div> */}
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center text-center">
  <div className="w-16 h-16 bg-purple-500 text-white flex items-center justify-center rounded-full mb-4">
    <span className="text-2xl font-bold">A</span>
  </div>
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin</h3>
  
  {/* Replace the button with plain text */}
  <p className="text-gray-600 font-medium">Login admin with default</p>
  <p className="text-gray-600 font-medium">"praveenadmin@gmail.com"</p>
  <p className="text-gray-600 font-medium">"Praveen@18"</p>
</div>

      </div>

      {/* Login Link */}
      <div className="mt-8 text-gray-700">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registerpage;
