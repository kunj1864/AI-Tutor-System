// src/pages/LessonDetails.jsx 

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/LessonDetails.css'; 
import '../styles/Global.css';

const LessonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessonDetails = async () => {
            try {
                const response = await api.get(`/available-lessons/${id}/`);
                setLesson(response.data);
            } catch (err) {
                console.error("Failed to load lesson:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLessonDetails();
    }, [id]);

    const getEmbedUrl = (url) => {
        if (!url) return null;
        const videoId = url.split('v=')[1] || url.split('/').pop();
        const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
        const finalId = ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
        return `https://www.youtube.com/embed/${finalId}`;
    };

    if (loading) return <div style={{textAlign:'center', padding:'5rem'}}><p>Loading Course...</p></div>;
    if (!lesson) return <div style={{textAlign:'center', padding:'5rem'}}><p>Course not found.</p></div>;

    // Data Lists
    const learnPoints = lesson.what_you_will_learn ? lesson.what_you_will_learn.split('\n') : [];
    const includesPoints = lesson.course_includes ? lesson.course_includes.split('\n') : [];
    const curriculumPoints = lesson.curriculum ? lesson.curriculum.split('\n') : [];

    return (
        <div className="lesson-detail-container">
            
            {/* Back Button */}
            <button onClick={() => navigate('/lessons')} className="back-btn">
                &larr; Back to Courses
            </button>

            {/* Header */}
            <div className="lesson-header">
                <h1>{lesson.title}</h1>
                <p className="lesson-description">{lesson.description}</p>
                
                <div className="lesson-meta">
                    <span className="lesson-badge">📂 {lesson.category}</span>
                    <span className="lesson-badge">⏱️ {lesson.duration || 'Flexible'}</span>
                </div>
            </div>

            {/* Video Player */}
            {lesson.video_url && (
                <div className="video-wrapper">
                    <iframe src={getEmbedUrl(lesson.video_url)} title={lesson.title} allowFullScreen></iframe>
                </div>
            )}

            {/* What you'll learn Box */}
            <div className="what-you-learn-box">
                <h3>✨ What you'll learn</h3>
                <div className="learning-grid">
                    {learnPoints.map((point, index) => (
                        <div key={index} className="learning-item">
                            <span className="check-icon">✔</span> 
                            <p>{point}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Course Content */}
            <div className="course-content-section">
                <h3>📚 Course Content</h3>
                <div>
                    {curriculumPoints.map((item, index) => (
                        <div key={index} className="content-item">
                            <span style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                📄 {item.split('-')[0]}
                            </span>
                            <span style={{color:'#666', fontSize:'0.9rem'}}>
                                {item.split('-')[1] || ''}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* This Course Includes */}
            <div className="includes-section">
                <h3>💎 This course includes:</h3>
                <div className="includes-grid">
                    {includesPoints.map((item, index) => (
                        <div key={index} className="includes-item">
                            🔹 {item}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Resources & Actions */}
            <div className="resources-section">
                <h3>🚀 Ready to start?</h3>
                <div className="resources-buttons">
                    
                    {/* QUIZ BUTTON (Primary) */}
                    <button onClick={() => navigate(`/quiz/${lesson.id}`)} className="btn-primary">
                        🧠 Take the Quiz
                    </button>

                    {/* PDF BUTTON */}
                    {lesson.pdf_url && (
                        <a href={lesson.pdf_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <button className="btn-secondary">
                                📥 Download Notes (PDF)
                            </button>
                        </a>
                    )}
                </div>
            </div>

        </div>
    );
};

export default LessonDetails;