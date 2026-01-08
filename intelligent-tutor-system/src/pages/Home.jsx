// src/pages/Home.jsx 

import React, { useState, useEffect, useRef } from 'react'; 
import { Link } from 'react-router-dom'; 
import api from '../api'; 
import '../styles/Home.css'; 
import '../styles/Global.css'; 

const Home = () => {
  const [allCourses, setAllCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const [trendingRes, availableRes] = await Promise.all([
            api.get('/trending-courses/'),    
            api.get('/available-lessons/')
        ]);
        
        const allCoursesMap = new Map();
        trendingRes.data.forEach(course => allCoursesMap.set(course.id, course));
        availableRes.data.forEach(course => allCoursesMap.set(course.id, course));
        
        const combinedCourses = Array.from(allCoursesMap.values());
        setAllCourses(combinedCourses); 
        
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCourses();
  }, []); 

  
  const feature1Ref = useRef(null);
  const feature2Ref = useRef(null);
  const feature3Ref = useRef(null);
  const feature4Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible'); 
            observer.unobserve(entry.target); 
          }
        });
      }, { threshold: 0.2 }
    );

    if (feature1Ref.current) observer.observe(feature1Ref.current);
    if (feature2Ref.current) observer.observe(feature2Ref.current);
    if (feature3Ref.current) observer.observe(feature3Ref.current);
    if (feature4Ref.current) observer.observe(feature4Ref.current);

    return () => {
      if (feature1Ref.current) observer.unobserve(feature1Ref.current);
      if (feature2Ref.current) observer.unobserve(feature2Ref.current);
      if (feature3Ref.current) observer.unobserve(feature3Ref.current);
      if (feature4Ref.current) observer.unobserve(feature4Ref.current);
    };
  }, [loading]); 

  const YOUR_EMAIL = "kunjdarji12@gmail.com";
  const formSubmitUrl = `https://formsubmit.co/${YOUR_EMAIL}`;
  
  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const coursesToShow = searchTerm 
    ? filteredCourses 
    : allCourses.filter(c => c.is_trending === true); 

  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
            <h1>Get your <span>Education</span> today!</h1>
            <p style={{fontSize: '1.2rem', color: '#eee'}}>The best way to learn and grow is here.</p>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="hero-info-boxes">
        <Link to="/lessons" style={{ textDecoration: 'none' }}>
          <div className="info-box">
              <div className="info-box-icon">📚</div>
              <h3>Online Courses</h3>
              <p>View More</p>
          </div>
        </Link>
        <Link to="/quiz" style={{ textDecoration: 'none' }}>
          <div className="info-box">
              <div className="info-box-icon">📖</div>
              <h3>Quiz Library</h3>
              <p>View More</p>
          </div>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div className="info-box">
              <div className="info-box-icon">👨‍🏫</div>
              <h3>AI Tutor</h3>
              <p>View More</p>
          </div>
        </Link>
      </div>

      {/* Popular Courses */}
      <div className="popular-courses-section">
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search for any course (e.g., Python, Math...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h2 className="popular-courses-title">
            {searchTerm ? `Search Results for "${searchTerm}"` : '🔥Popular Courses🔥'}
        </h2>
        
        <div className="trending-grid">
          {loading ? (
            <p>Loading courses...</p>
          ) : (
            coursesToShow.map((course) => (
              <div key={course.id} className="course-card">
                <img src={course.image_url} alt={course.title} />
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <Link to={`/lessons/${course.id}`} className="explore-button">
                  Explore
                </Link>
              </div>
            ))
          )}
          
          {!loading && coursesToShow.length === 0 && searchTerm && (
            <p>No courses found matching "{searchTerm}". Try a different search.</p>
          )}
        </div>
      </div> 

      
      <div className="features-section">

       
        <div className="feature-row" ref={feature1Ref}>
          <div className="feature-text">
            <h2>Learn at your own pace</h2>
            <p>"Empower your learning journey with our e-learning website. Explore a diverse selection of courses at your own pace, tailored to your needs and interests."</p>
          </div>
          <div className="feature-image">
            <img src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Learn at your pace" />
          </div>
        </div>

       
        <div className="feature-row reverse" ref={feature2Ref}>
          <div className="feature-text">
            <h2>Community of opportunities</h2>
            <p>"Join our e-learning website and become a part of a thriving community of opportunities. Unlock your potential through a variety of courses, network with fellow learners, and pave the way to a brighter future."</p>
          </div>
          <div className="feature-image">
            <img src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Community" />
          </div>
        </div>

        
        <div className="feature-row" ref={feature3Ref}>
          <div className="feature-text">
            <h2>Real-life skill assessments</h2>
            <p>"Sharpen your skills with personalized guidance. Our AI tutor adapts to your level and provides continuous coaching to help you grow."</p>
          </div>
          <div className="feature-image">
           
            <img src="https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Skill Assessment" />
          </div>
        </div>

       
        <div className="feature-row reverse" ref={feature4Ref}>
          <div className="feature-text">
            <h2>Fit learning into your work-life balance</h2>
            <p>"Access TutorAI on your preferred device and turn spare moments into powerful learning opportunities."</p>
          </div>
          <div className="feature-image">
           
            <img src="https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Work Life Balance" />
          </div>
        </div>
        
      </div>

      
      
    </div>
  );
};

export default Home;