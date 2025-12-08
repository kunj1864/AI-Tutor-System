// src/components/LessonCard.jsx
import React from 'react';
import './LessonCard.css';


const LessonCard = ({ title, description }) => (
  <div className="lesson-card">

  {/* <div style={{
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}> */}
    <h3>{title}</h3>
    <p>{description}</p>
    <button style={{
      marginTop: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }}>
      Start Lesson
    </button>
  </div>
);

export default LessonCard;