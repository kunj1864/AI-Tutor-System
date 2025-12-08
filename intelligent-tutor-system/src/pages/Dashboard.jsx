// src/pages/Dashboard.jsx 

import React, { useState, useEffect } from 'react';
import api from '../api'; 
import '../styles/Dashboard.css'; 
import '../styles/global.css'; 

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // Progress States
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState("Calculating your journey...");
  

  const [aiPrediction, setAiPrediction] = useState("Loading AI insights...");

  // Chatbot states
  const [tutorInput, setTutorInput] = useState('');
  const [tutorResponse, setTutorResponse] = useState("Hello! 👋 I am your personal AI Study Companion.\n\nAsk me anything about your lessons, coding, or math!");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch Real-Time Progress & Prediction
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/dashboard/progress/');
        
        
        const { progress_percentage, progress_text, ai_prediction } = response.data;
        
        setProgressText(progress_text);
        setAiPrediction(ai_prediction);
        
        
        setTimeout(() => {
            setProgressPercent(progress_percentage);
        }, 300);

      } catch (err) {
        console.error("Progress fetch error:", err);
        setProgressText("Start learning to see progress!");
        setAiPrediction("AI needs more data to predict your success.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);


  // 2. AI Tutor Handler
  const handleAskTutor = async () => {
    if (!tutorInput.trim()) return;

    const userQuestion = tutorInput;
    setTutorInput(''); 
    setIsTyping(true); 
    setTutorResponse("Thinking... 🤖"); 
    setErrorMessage(""); 

    try {
      const response = await api.post('/ask-tutor-ai/', {
        question: userQuestion
      });
      setTutorResponse(response.data.answer);

    } catch (err) {
      console.error("AI Error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setTutorResponse("❌ Oops! My brain is disconnected.");
        setErrorMessage(err.response.data.error);
      } else {
        setTutorResponse("❌ Connection Lost.");
        setErrorMessage("Could not connect to the server. Please check internet.");
      }
    } finally {
      setIsTyping(false); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAskTutor();
  };

  if (loading) {
    return <div className="dashboard-container"><p style={{textAlign:'center', marginTop:'50px'}}>Loading your Dashboard...</p></div>;
  }

  return (
    <div className="dashboard-container">
      
      
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Track your progress and get AI-powered insights.</p>
      </div>

      
      {errorMessage && (
        <div style={{background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #ffcdd2'}}>
            ⚠️ <strong>System Error:</strong> {errorMessage}
        </div>
      )}

      
      <div style={{
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          padding: '2rem',
          borderRadius: '20px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(37, 117, 252, 0.3)',
          textAlign: 'center',
          marginBottom: '2rem',
          border: '1px solid rgba(255,255,255,0.2)'
      }}>
          <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🔮</div>
          <h3 style={{margin: 0, fontSize: '1.6rem', fontWeight: '700'}}>AI Performance Predictor</h3>
          
          <p style={{marginTop: '1rem', fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.5'}}>
            
            {aiPrediction}
          </p>
          
          <p style={{fontSize: '0.85rem', opacity: 0.8, marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '0.5rem'}}>
            Powered by Logistic Regression Algorithm (Analysis based on your quiz scores).
          </p>
      </div>

      {/* PROGRESS SECTION */}
      <div className="progress-section">
        <h2 style={{color: '#333', marginBottom: '1rem'}}>🚀 Learning Progress</h2>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }} 
          >
            {progressPercent > 5 && `${progressPercent}%`}
          </div>
        </div>
        
        <p style={{fontSize: '1.1rem', color: '#555', fontWeight: '500'}}>
          {progressText}
        </p>
      </div>

      {/* AI TUTOR SECTION (Chat Style) */}
      <div className="tutor-section">
        <div className="tutor-header">
            <div className="tutor-icon">🤖</div>
            <div>
                <h3 style={{color: 'white', margin: 0}}>AI Study Assistant</h3>
                <div className="tutor-status">
                    <div className="status-dot"></div>
                    <span>Online & Ready to Help</span>
                </div>
            </div>
        </div>

        <div className="tutor-chat-area">
            <div className="tutor-message-bubble">
                <p style={{margin: 0, whiteSpace: 'pre-wrap'}}>{tutorResponse}</p>
            </div>
        </div>

        <div className="tutor-input-wrapper">
          <input
            type="text"
            placeholder="Ask a doubt..."
            value={tutorInput}
            onChange={(e) => setTutorInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping} 
          />
          <button className="tutor-send-btn" onClick={handleAskTutor} disabled={isTyping}>
            {isTyping ? '...' : 'Send ➤'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;