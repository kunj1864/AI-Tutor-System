// src/pages/Quiz.jsx 

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; 
import QuizCard from '../components/QuizCard'; 
import LevelCard from '../components/LevelCard'; 
import '../styles/Quiz_Component_Styles.css'; 
import '../styles/Global.css'; 

const Quiz = () => {
    const { id: urlLessonId } = useParams(); 
    const navigate = useNavigate();
    
    // UI States
    const [currentView, setCurrentView] = useState(urlLessonId ? 'loading' : 'lessons'); 
    const [lessons, setLessons] = useState([]);
    const [levelsStatus, setLevelsStatus] = useState([]);
    const [questions, setQuestions] = useState([]);
    
    // Active Quiz Data
    const [activeLessonId, setActiveLessonId] = useState(urlLessonId ? parseInt(urlLessonId) : null);
    const [activeLevel, setActiveLevel] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    
    // Result & Logic States
    const [lastAnswerStatus, setLastAnswerStatus] = useState(null); 
    const [currentProgress, setCurrentProgress] = useState({ correct_count: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizResult, setQuizResult] = useState(null);

    // --- 1. Effects ---

    
    useEffect(() => {
        if (!urlLessonId) {
            
            setActiveLessonId(null);
            setCurrentView('lessons');
        } else {
           
            setActiveLessonId(parseInt(urlLessonId));
        }
    }, [urlLessonId]);

    // Fetch Lessons List
    useEffect(() => {
        const fetchLessons = async () => {
            setLoading(true);
            try {
                const response = await api.get('/quiz/lessons/'); 
                setLessons(response.data);
            } catch (err) {
                setError("Failed to fetch lessons.");
            } finally {
                setLoading(false);
            }
        };
        
        if (lessons.length === 0) fetchLessons();
        
        if (!urlLessonId) {
            setCurrentView('lessons');
            setLoading(false);
        }
    }, [urlLessonId]);

    // Fetch Levels
    useEffect(() => {
        const fetchLevels = async () => {
            if (!activeLessonId) return;
            setLoading(true);
            setQuizResult(null); 
            try {
                const response = await api.get(`/quiz/levels/${activeLessonId}/`);
                setLevelsStatus(response.data);
                setCurrentView('levels');
            } catch (err) {
                setError("Failed to load levels.");
            } finally {
                setLoading(false);
            }
        };
        if (activeLessonId) fetchLevels();
    }, [activeLessonId]);

    // Fetch Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!activeLevel || !activeLessonId) return;
            setLoading(true);
            try {
                const response = await api.get(`/quiz/questions/${activeLessonId}/${activeLevel}/`);
                if (response.data.message) {
                    setError(response.data.message);
                } else {
                    setQuestions(response.data);
                    setCurrentQIndex(0);
                    setLastAnswerStatus(null);
                    setCurrentProgress({ correct_count: 0 }); 
                    setCurrentView('questions');
                }
            } catch (err) {
                setError("Failed to load questions.");
            } finally {
                setLoading(false);
            }
        };
        if (activeLevel && activeLessonId && currentView === 'loadingQuestions') fetchQuestions();
    }, [activeLevel, activeLessonId, currentView]);


    // --- 2. Handlers ---

    
    const handleBackToQuiz = () => {
        setActiveLessonId(null);   
        setQuestions([]);          
        setLevelsStatus([]);       
        setCurrentView('lessons'); 
        navigate('/quiz');         
    };

    const handleLessonSelect = (lessonId) => {
        setActiveLessonId(lessonId);
        navigate(`/quiz/${lessonId}`);
        
    };
    
    const handleLevelSelect = (levelKey, isUnlocked) => {
        if (!isUnlocked) {
            alert("Please complete the previous level first!");
            return;
        }
        setActiveLevel(levelKey);
        setCurrentView('loadingQuestions'); 
    };
    
    const handleQuizFinish = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/quiz/result/${activeLessonId}/${activeLevel}/`);
            setQuizResult(response.data);
            setCurrentView('result'); 
        } catch (err) {
            setError("Could not calculate result.");
            setCurrentView('resultError'); 
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async (choiceId) => {
        if (lastAnswerStatus || loading) return;
        setLoading(true);
        setError(null);

        try {
            const response = await api.post(`/quiz/submit-answer/${activeLessonId}/`, {
                question_id: questions[currentQIndex].id,
                choice_id: choiceId,
                level: activeLevel
            });

            const data = response.data;
            setLastAnswerStatus(data); 
            setCurrentProgress(prev => ({ ...prev, correct_count: data.new_score }));
            setLoading(false); 

            setTimeout(() => {
                const nextIndex = currentQIndex + 1;
                if (nextIndex >= questions.length) {
                    handleQuizFinish();
                } else {
                    setLastAnswerStatus(null); 
                    setCurrentQIndex(nextIndex); 
                }
            }, 2000); 

        } catch (err) {
            setError("Error submitting answer.");
            setLoading(false); 
        } 
    };

    // --- 3. Render Views ---
    
    if (loading && currentView !== 'questions') return <div className="quiz-main-container"><p>Loading...</p></div>;
    
    const activeLesson = lessons.find(l => l.id === activeLessonId);

    // VIEW 1: Lesson Selection
    if (currentView === 'lessons' || !activeLessonId) {
        return (
            <div className="quiz-main-container">
                <div className="quiz-header">
                    <h1>📚 Select Quiz Subject</h1>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div className="quiz-card-grid">
                    {lessons.map(lesson => (
                        <QuizCard key={lesson.id} lesson={lesson} onClick={handleLessonSelect} /> 
                    ))}
                </div>
            </div>
        );
    }
    
    // VIEW 2: Level Selection
    if (currentView === 'levels' && activeLesson) {
        return (
            <div className="quiz-main-container">
                <div className="quiz-header">
                    <h1>🎯 Levels: {activeLesson.title}</h1>
                </div>
                <div className="quiz-card-grid">
                    {levelsStatus.map(status => (
                        <LevelCard key={status.level} status={status} onClick={handleLevelSelect} /> 
                    ))}
                </div>
                
                
                <button 
                    className="quiz-action-btn" 
                    style={{background: '#6c757d', marginTop: '2rem'}} 
                    onClick={handleBackToQuiz}
                >
                    &larr; Back to Quiz
                </button>
            </div>
        );
    }

    // VIEW 3: Questions
    const currentQuestion = questions[currentQIndex];
    if (currentView === 'questions' && currentQuestion) {
        const progressPercent = ((currentQIndex) / questions.length) * 100;

        return (
            <div className="quiz-main-container">
                <div className="quiz-progress-track">
                    <div className="quiz-progress-fill" style={{width: `${progressPercent}%`}}></div>
                </div>

                <div className="quiz-header">
                    <h2 style={{margin:0, color: '#555'}}>Question {currentQIndex + 1} of {questions.length}</h2>
                    <span style={{background:'#e3f2fd', color:'#007bff', padding:'0.5rem 1rem', borderRadius:'20px', fontWeight:'bold'}}>
                        Score: {currentProgress.correct_count}
                    </span>
                </div>
                
                <h3 className="quiz-question-text">{currentQuestion.text}</h3>
                
                <div className="quiz-options-grid">
                    {currentQuestion.choices.map(choice => {
                        let btnClass = 'quiz-option-btn';
                        if (lastAnswerStatus) {
                            if (choice.id === lastAnswerStatus.choice_id) {
                                btnClass += lastAnswerStatus.is_correct ? ' correct' : ' incorrect';
                            }
                            if (choice.id === lastAnswerStatus.correct_choice_id && !lastAnswerStatus.is_correct) {
                                btnClass += ' correct';
                            }
                        }
                        return (
                            <button 
                                key={choice.id}
                                className={btnClass}
                                onClick={() => handleSubmitAnswer(choice.id)}
                                disabled={loading || lastAnswerStatus} 
                            >
                                {choice.text}
                            </button>
                        );
                    })}
                </div>

                {lastAnswerStatus && (
                    <div className={`quiz-feedback-box ${lastAnswerStatus.is_correct ? 'quiz-feedback-correct' : 'quiz-feedback-incorrect'}`}>
                        <h3 style={{margin:0}}>{lastAnswerStatus.is_correct ? '🎉 Correct!' : '❌ Oops!'}</h3>
                        {!lastAnswerStatus.is_correct && (
                            <p><strong>Correct Answer:</strong> {lastAnswerStatus.correct_answer_text}</p>
                        )}
                        <p style={{marginTop:'0.5rem'}}>💡 {currentQuestion.explanation}</p>
                    </div>
                )}

                <button className="quiz-action-btn" style={{background: '#6c757d'}} onClick={() => {setActiveLevel(null); setCurrentView('levels');}}>
                    Quit Level
                </button>
            </div>
        );
    }

    // VIEW 4: Result
    if (currentView === 'result' && quizResult) {
        return (
            <div className="quiz-main-container" style={{textAlign: 'center'}}>
                <div className="quiz-header" style={{justifyContent: 'center'}}>
                    <h1>🏆 Quiz Completed!</h1>
                </div>
                
                <div className="quiz-base-card" style={{textAlign: 'center', border: `2px solid ${quizResult.status_color}`}}>
                    <h2 style={{color: quizResult.status_color, fontSize: '2rem'}}>{quizResult.status_msg}</h2>
                    <div style={{fontSize: '4rem', fontWeight: '900', margin: '1rem 0', color: '#333'}}>
                        {quizResult.final_score} <span style={{fontSize: '1.5rem', color: '#999'}}>/ 20</span>
                    </div>
                    <p style={{fontSize: '1.2rem', color: '#555'}}>"{quizResult.feedback}"</p>
                    {quizResult.level_unlocked && (
                        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '10px', color: '#2e7d32', fontWeight:'bold'}}>
                            🔓 Next Level Unlocked!
                        </div>
                    )}
                </div>

               
                <button className="quiz-action-btn" style={{background: '#ff9800'}} onClick={() => {setActiveLevel(null); setCurrentView('levels');}}>
                    Back to Levels
                </button>
            </div>
        );
    }

    return <div className="quiz-main-container"><p>Loading...</p></div>;
};

export default Quiz;