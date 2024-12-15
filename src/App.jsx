import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Registerpage from './pages/Registerpage';
import Loginpage from './pages/Loginpage';
import StudentRegisterForm from './pages/StudentRegisterForm';
import TutorRegisterForm from './pages/TutorRegisterForm';
import AdminRegisterForm from './pages/AdminRegisterForm';
import StudentLoginForm from './pages/StudentLoginForm';
import TutorLoginForm from './pages/TutorLoginForm';
import AdminLoginForm from './pages/AdminLoginForm';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TutorsLesson from './pages/TutorsLesson';
import CreateLessonForm from './components/CreateLessonForm';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/registerstudent" element={<StudentRegisterForm />} />
        <Route path="/registertutor" element={<TutorRegisterForm />} />
        <Route path="/registeradmin" element={<AdminRegisterForm />} />
        <Route path="/loginstudent" element={<StudentLoginForm />} />
        <Route path="/logintutor" element={<TutorLoginForm />} />
        <Route path="/loginadmin" element={<AdminLoginForm />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/tutordashboard" element={<TutorDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/tutors/lessons/:tutorId" element={<TutorsLesson />} />
        {/* <Route path="/tutors/createlessons" element={<CreateLessonForm />} /> */}

        </Routes>
    </BrowserRouter>
  );
};

export default App;
