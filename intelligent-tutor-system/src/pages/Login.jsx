// src/pages/Login.jsx 

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post('/auth/login/', {
        username: username,
        password: password,
      });
      
      const token = response.data.access; 
      if (token) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        alert("Login successful!");
        navigate("/dashboard");
      } else {
        setError("Login failed: Token missing.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setLoading(false);
      if (err.response && err.response.data) {
          
          const msg = err.response.data.non_field_errors || "Invalid credentials.";
          setError(Array.isArray(msg) ? msg[0] : JSON.stringify(msg));
      } else {
          setError("Login failed. Please check server connection.");
      }
    }
  };

  // 2. Google Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      try {
        const response = await api.post('/auth/google/', {
          access_token: tokenResponse.access_token,
        });
        
        const token = response.data.access;
        if (token) {
          localStorage.setItem('access_token', token);
          if (response.data.refresh) {
            localStorage.setItem('refresh_token', response.data.refresh);
          }
          alert("Google Login successful!");
          navigate("/dashboard");
        } else {
           setError("Google Login failed: Token nahi mila.");
        }
      } catch (err) {
        setError("Google login failed.");
        console.error(err);
      }
    },
    onError: () => {
      setError("Google login failed.");
    }
  });

  return (
    <div className="auth-wrapper"> 
      <div className="auth-card">
        
       
        <div className="auth-image">
          <img 
            src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?w=740" 
            alt="Student Login" 
          />
        </div>
        
        <div className="auth-form">
          <h2>Student Login</h2>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="remember">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="submit">Login</button>
          </form>

          <div className="auth-divider">or</div>

          <div className="auth-social-login">
            <button className="social-btn" onClick={() => handleGoogleLogin()}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" height="24" />
            </button>
            <button className="social-btn" onClick={() => alert('Coming soon!')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" height="24" />
            </button>
            <button className="social-btn" onClick={() => alert('Coming soon!')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" height="24" />
            </button>
          </div>
          
          <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#555'}}>
            Don't have an account? <Link to="/signup" style={{color: '#007bff', fontWeight: '600'}}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;