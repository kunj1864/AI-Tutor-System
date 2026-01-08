// src/pages/Lessons.jsx 

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../api'; 
import '../styles/Lessons_Component_Styles.css'; 
import '../styles/Global.css'; 

// Sidebar Component
const LessonSidebar = ({ selectedTab, setSelectedTab }) => (
  <div className="lesson-sidebar">
    <h4>Lesson View</h4>
    <button 
        className={`sidebar-button ${selectedTab === 'available' ? 'active' : ''}`}
        onClick={() => setSelectedTab('available')}
    >
        Available Courses
    </button>
    <button 
        className={`sidebar-button ${selectedTab === 'my' ? 'active' : ''}`}
        onClick={() => setSelectedTab('my')}
    >
        My Lessons
    </button>
  </div>
);

// Card Component
const LessonCard = ({ lesson, isMyLesson, onStartLesson }) => {
    const courseData = isMyLesson ? lesson.lesson : lesson;
    const title = courseData.title;
    const description = isMyLesson 
        ? (lesson.status === 'COMPLETED' ? `Completed: ${new Date(lesson.completed_at).toLocaleDateString()}` : 'In progress')
        : courseData.description;

    const handleAction = (e) => {
        if (!isMyLesson && onStartLesson) {
            onStartLesson(courseData.id, ""); 
        }
    };

    return (
        <div className="lesson-course-card">
            
            <div className="card-image-container">
                <img 
                    src={courseData.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
                    alt={title}
                />
            </div>
            
            <div className="lesson-course-card-content"> 
                <h3>{title}</h3>
                <p>{description}</p>
                
                <Link 
                    to={`/lessons/${courseData.id}`} 
                    onClick={handleAction}
                >
                    <button className="study-button">
                        View Study Material
                    </button>
                </Link>
            </div>
        </div>
    );
};


const Lessons = () => {
  const [selectedTab, setSelectedTab] = useState('available');
  const [availableLessons, setAvailableLessons] = useState([]);
  const [myLessons, setMyLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const [availRes, myRes] = await Promise.all([
        api.get('/available-lessons/'), 
        api.get('/my-lessons/')        
      ]);
      setAvailableLessons(availRes.data);
      setMyLessons(myRes.data);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setError("Failed to load courses. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = async (lessonId) => {
    try {
        await api.post(`/lessons/start/${lessonId}/`); 
    } catch (err) {
        console.error("Lesson start track error", err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const lessonsToShow = selectedTab === 'available' ? availableLessons : myLessons;
  const isMyLessonTab = selectedTab === 'my';

  return (
    <div className="lessons-grid-container">
      <LessonSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="lesson-content-area">
        <h1>
          {selectedTab === 'available' ? '📚 Available Courses' : '✅ My Courses'}
        </h1>
        {error && <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="lesson-card-grid">
            {lessonsToShow.length > 0 ? (
                lessonsToShow.map((lesson) => (
                    <LessonCard 
                        key={isMyLessonTab ? lesson.lesson.id : lesson.id} 
                        lesson={lesson} 
                        isMyLesson={isMyLessonTab} 
                        onStartLesson={!isMyLessonTab ? handleStartLesson : null} 
                    />
                ))
            ) : (
                <p>
                    {isMyLessonTab ? 
                        'You have not started any lessons yet. Start one from Available Courses!' :
                        'No other courses found.'
                    }
                </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;