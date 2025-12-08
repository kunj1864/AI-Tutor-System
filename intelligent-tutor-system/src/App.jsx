// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; 
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz'; 
import Lessons from './pages/Lessons';
import LessonDetails from './pages/LessonDetails'; 
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';

import './styles/global.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
       
        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          
          <Route
            path="/lessons"
            element={<ProtectedRoute><Lessons /></ProtectedRoute>}
          />
          
          {/* Lesson Details Route */}
          <Route
            path="/lessons/:id"
            element={<ProtectedRoute><LessonDetails /></ProtectedRoute>}
          />

          {/* Quiz Routes */}
          <Route
            path="/quiz"
            element={<ProtectedRoute><Quiz /></ProtectedRoute>}
          />
          <Route
            path="/quiz/:id"
            element={<ProtectedRoute><Quiz /></ProtectedRoute>}
          />
          
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />

        </Routes> 
       
      </main>
      
      <footer className="footer">
        <p>© 2025 AI Tutor. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;