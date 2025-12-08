// src/pages/Signup.jsx 

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";
import { useGoogleLogin } from '@react-oauth/google';

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "", // Confirm password
    dob: "",
    college: "",
    qualification: "",
    roll_number: "",
    year: "",
    course: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.password2) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
        // 1. Register Call
        await api.post('/auth/registration/', {
            username: form.username,
            email: form.email,
            password1: form.password, 
            password2: form.password2 
        });

        // 2. Login Call 
        const loginResponse = await api.post('/auth/login/', {
            username: form.username,
            password: form.password
        });
        
        const token = loginResponse.data.access;
        
        
        localStorage.setItem('access_token', token); 
        if (loginResponse.data.refresh) {
            localStorage.setItem('refresh_token', loginResponse.data.refresh);
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
        
        // 3. Profile Update Call
        await api.patch('/auth/user/', {
            profile: {
                dob: form.dob || null,
                college: form.college,
                qualification: form.qualification,
                roll_number: form.roll_number,
                year: form.year,
                course: form.course
            }
        });

       
        
        setLoading(false);
        alert("Signup successful! Welcome to AI Tutor.");
        navigate("/dashboard"); 

    } catch (err) {
      setLoading(false);
      console.error("Signup Error:", err);

      if (err.response && err.response.data) {
        const data = err.response.data;
        let errorMsg = "";
        
        Object.keys(data).forEach(key => {
            const messages = Array.isArray(data[key]) ? data[key].join(" ") : data[key];
            errorMsg += `${key.toUpperCase()}: ${messages}\n`;
        });
        setError(errorMsg); 
      } else {
        setError("Signup failed. Server not responding.");
      }
    }
  };

  // Google Logic
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        try {
            const response = await api.post('/auth/google/', {
                access_token: tokenResponse.access_token,
            });
            localStorage.setItem('access_token', response.data.access);
            if (response.data.refresh) {
                localStorage.setItem('refresh_token', response.data.refresh);
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            
            alert("Google Signup Successful!");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Google signup failed.");
        }
    },
    onError: () => setError("Google login failed.")
  });


  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-image" style={{backgroundColor: '#e6fffa'}}>
          <img 
            src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?w=740"
            alt="Student Signup" 
          />
        </div>
        
        <div className="auth-form" style={{overflowY: 'auto', maxHeight: '90vh', padding: '2rem 3rem'}}>
          <h2>Student Registration</h2>
          
          {error && (
              <div style={{
                  backgroundColor: '#ffe6e6', 
                  color: '#d32f2f', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-line'
              }}>
                  {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Full Name (or Username)" value={form.username} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password (min. 8 characters)" value={form.password} onChange={handleChange} required />
            <input type="password" name="password2" placeholder="Confirm Password" value={form.password2} onChange={handleChange} required />
            
            <hr style={{margin: '1rem 0', border: 'none', borderTop: '1px solid #eee'}} />
            
            <input type="date" name="dob" value={form.dob} onChange={handleChange} title="Date of Birth" />
            <input type="text" name="college" placeholder="College/School Name" value={form.college} onChange={handleChange} />
            <input type="text" name="qualification" placeholder="Qualification (e.g. 12th Pass)" value={form.qualification} onChange={handleChange} />
            <input type="text" name="roll_number" placeholder="Roll Number" value={form.roll_number} onChange={handleChange} />
            <input type="text" name="course" placeholder="Course (e.g. B.Sc IT)" value={form.course} onChange={handleChange} />
            <input type="text" name="year" placeholder="Year (e.g. 3rd Year)" value={form.year} onChange={handleChange} />
            
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Register'}
            </button>
          </form>
          
          <div className="auth-divider">or</div>
          <div className="auth-social-login">
             <button className="social-btn" onClick={() => handleGoogleLogin()}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" height="24" />
             </button>
          </div>

           <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#555'}}>
            Already have an account? <Link to="/login" style={{color: '#007bff', fontWeight: '600'}}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;