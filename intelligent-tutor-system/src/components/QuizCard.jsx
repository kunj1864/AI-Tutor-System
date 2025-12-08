// src/components/LessonCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
    padding: '1.5rem', 
    borderRadius: '10px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
    cursor: 'pointer', 
    background: '#f8f8f8',
    transition: 'transform 0.2s ease',
    textAlign: 'center'
};

const QuizCard = ({ lesson, onClick }) => {
    return (
        <div 
            style={cardStyle} 
            className="quiz-base-card quiz-lesson-card"
            onClick={() => onClick(lesson.id)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            
            <h3 style={{ color: '#3f51b5', marginBottom: '0.5rem' }}>{lesson.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Category: {lesson.category}</p>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>{lesson.description}</p>
            <span style={{ fontSize: '0.9rem', color: '#ff9800', marginTop: '1rem', display: 'block' }}>
                Select for Quiz &rarr;
            </span>
        </div>
    );
};

export default QuizCard;