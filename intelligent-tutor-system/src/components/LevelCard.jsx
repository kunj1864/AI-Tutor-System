// src/components/LevelCard.jsx (Banaao aur paste karo)

import React from 'react';

const levelCardStyle = (unlocked, completed) => ({ 
    padding: '1.5rem', 
    borderRadius: '10px', 
    textAlign: 'center', 
    backgroundColor: completed ? '#e6ffed' : (unlocked ? '#fff8e6' : '#f0f0f0'),
    border: `2px solid ${completed ? '#4caf50' : (unlocked ? '#ff9800' : '#ccc')}`,
    opacity: unlocked ? 1 : 0.7,
    cursor: unlocked ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s ease',
    boxShadow: completed ? '0 0 10px rgba(76, 175, 80, 0.5)' : (unlocked ? '0 0 5px rgba(255, 152, 0, 0.5)' : 'none'),
    transform: unlocked ? 'scale(1)' : 'scale(0.98)',
});

const buttonStyle = { 
    padding: '0.6rem 1.5rem', 
    margin: '0.5rem 0', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    background: '#007bff', 
    color: 'white', 
    fontWeight: 'bold' 
};

const LevelCard = ({ status, onClick }) => {
    const { level, display_name, is_unlocked, is_completed, correct_count, required_count } = status;
    let cardClass = 'quiz-base-card ';
    if (is_completed) {
        cardClass += 'level-card-completed';
    } else if (is_unlocked) {
        cardClass += 'level-card-unlocked';
    } else {
        cardClass += 'level-card-locked';
    }
    return (
        <div 
            style={levelCardStyle(is_unlocked, is_completed)}
            className={cardClass}
            onClick={() => onClick(level, is_unlocked)}
            onMouseOver={(e) => { if (is_unlocked) e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseOut={(e) => { if (is_unlocked) e.currentTarget.style.transform = 'scale(1)'; }}
        >
            <h4>{display_name}</h4>
            {is_completed ? (
                <p style={{ color: '#4caf50', fontWeight: 'bold' }}>✅ COMPLETED!</p>
            ) : (
                <>
                    {is_unlocked ? (
                        <p style={{ color: '#ff9800' }}>Progress: {correct_count}/{required_count} Correct</p>
                    ) : (
                        <p style={{ color: '#aaa' }}>🔒 Locked</p>
                    )}
                    <button 
                        style={{...buttonStyle, background: is_unlocked ? '#007bff' : '#ccc'}} 
                        disabled={!is_unlocked}
                    >
                        {is_unlocked ? 'Start / Continue' : 'Unlock Now'}
                    </button>
                </>
            )}
        </div>
    );
};

export default LevelCard;