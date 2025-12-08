// // src/components/LessonSidebar.jsx
// import React from 'react';

// const LessonSidebar = ({ selectedTab, setSelectedTab }) => (
//   <div style={{
//     backgroundColor: '#ffffff',
//     padding: '1rem',
//     borderRadius: '12px',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//     marginBottom: '2rem'
//   }}>
//     <h3 style={{ marginBottom: '1rem' }}>📂 Lesson View</h3>
//     <button
//       onClick={() => setSelectedTab('available')}
//       style={{
//         padding: '0.5rem 1rem',
//         marginBottom: '0.5rem',
//         backgroundColor: selectedTab === 'available' ? '#2196f3' : '#e3f2fd',
//         color: selectedTab === 'available' ? 'white' : '#1e1e2f',
//         border: 'none',
//         borderRadius: '6px',
//         cursor: 'pointer',
//         width: '100%',
//         fontWeight: 'bold'
//       }}
//     >
//       📚 Available Lessons
//     </button>
//     <button
//       onClick={() => setSelectedTab('my')}
//       style={{
//         padding: '0.5rem 1rem',
//         backgroundColor: selectedTab === 'my' ? '#ff4081' : '#fce4ec',
//         color: selectedTab === 'my' ? 'white' : '#1e1e2f',
//         border: 'none',
//         borderRadius: '6px',
//         cursor: 'pointer',
//         width: '100%',
//         fontWeight: 'bold'
//       }}
//     >
//       ✅ My Lessons
//     </button>
//   </div>
// );

// export default LessonSidebar;




// src/components/LessonSidebar.jsx
import React from 'react';
import './LessonSidebar.css';

const LessonSidebar = ({ selectedTab, setSelectedTab }) => (
  <div className="lesson-sidebar">
    <h3>📂 Lesson View</h3>
    <button
      className={selectedTab === 'available' ? 'active' : 'inactive'}
      onClick={() => setSelectedTab('available')}
    >
      📚 Available Lessons
    </button>
    <button
      className={selectedTab === 'my' ? 'active' : 'inactive'}
      onClick={() => setSelectedTab('my')}
    >
      ✅ My Lessons
    </button>
  </div>
);

export default LessonSidebar;