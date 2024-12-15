import React, { useState } from 'react';

const NavHome = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Manage dropdown visibility
  const [profile, setProfile] = useState({
    name: 'John Doe', // Replace with dynamic profile data
    email: 'john.doe@example.com', // Replace with dynamic profile data
    studentId: '123456', // Replace with dynamic profile data
  });

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div>
      <div className="bg-gray-800 text-white p-4 fixed w-full top-0 left-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-semibold">Digital Learning</div>
          <div className="relative">
            {/* Profile dropdown */}
            <div
              className="cursor-pointer text-lg font-semibold text-white"
              onClick={toggleProfileDropdown}
            >
              Profile
            </div>

            {/* Dropdown content */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-md z-20">
                <div className="p-4">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Student ID:</strong> {profile.studentId}</p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full bg-blue-500 text-white py-2 rounded-md">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavHome;
