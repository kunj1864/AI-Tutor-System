// // src/components/Navbar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => (
//   <nav className="navbar">
//     <h2>🧠 AI Tutor</h2>
//     <ul>
//       <li><Link to="/">Home</Link></li>
//       <li><Link to="/dashboard">Dashboard</Link></li>
//       <li><Link to="/quiz">Quiz</Link></li>

//       <li><Link to="/lessons">Lessons</Link></li>
//       <li><Link to="/profile">Profile</Link></li>
//     </ul>
//   </nav>
// );

// export default Navbar;


// src/components/Navbar.jsx
// src/components/Navbar.jsx (NAYA DESIGN)

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/Navbar.css'; 

const Navbar = () => {
    return (
        <nav className="navbar-container">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
                🧠AI TUTOR🧠
            </Link>

            {/* Links */}
            <div className="navbar-links">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    end 
                >
                    Home
                </NavLink>
                <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    Dashboard
                </NavLink>
                <NavLink 
                    to="/lessons" 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    Courses
                </NavLink>
                <NavLink 
                    to="/quiz" 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    Quiz (Library)
                </NavLink>
                <NavLink 
                    to="/profile" 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    Profile
                </NavLink>

                <NavLink 
                    to="/contact" 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    Contact Us
                </NavLink>
                
            
            </div>
            
            {/* Contact Button */}
            <div className="navbar-contact">
             
                
            </div>
        </nav>
    );
};

export default Navbar;