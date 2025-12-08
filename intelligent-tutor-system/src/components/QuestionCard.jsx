// src/components/QuestionCard.jsx
import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, options, onSelect }) => (
  <div className="question-card">
    <h3>{question}</h3>
    <ul>
      {options.map((opt, i) => (
        <li key={i} onClick={() => onSelect(opt)}>{opt}</li>
      ))}
    </ul>
  </div>
);

export default QuestionCard;