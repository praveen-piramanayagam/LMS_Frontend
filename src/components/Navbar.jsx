import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white p-4 fixed w-full top-0 left-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">Digital Learning</div>
        <div className="space-x-6">
          <Link
            to="/"
            className="hover:text-gray-400 transition duration-200 text-xl font-semibold"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
