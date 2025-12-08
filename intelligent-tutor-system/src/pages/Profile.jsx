// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import '../styles/global.css'; 
import '../styles/Auth.css'; 
import '../styles/Profile.css'; 


const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
};


const defaultAvatarStyle = {
    width: '120px', height: '120px', borderRadius: '50%', 
    backgroundColor: '#3f51b5', color: 'white', fontSize: '3rem', 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1.5rem auto', fontWeight: 'bold'
};

const Profile = () => {
  
  const [originalUser, setOriginalUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  
 
  const [formData, setFormData] = useState({
      username: '',
      email: '',
      dob: '',
      college: '',
      qualification: '',
      roll_number: '',
      year: '',
      course: ''
  });
  const [avatarUrl, setAvatarUrl] = useState(null); 

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/user/');
        
        
        setOriginalUser(response.data); 
        setAvatarUrl(response.data.profile_picture); 
        setFormData({
            username: response.data.username,
            email: response.data.email,
            dob: response.data.profile?.dob || '',
            college: response.data.profile?.college || '',
            qualification: response.data.profile?.qualification || '',
            roll_number: response.data.profile?.roll_number || '',
            year: response.data.profile?.year || '',
            course: response.data.profile?.course || ''
        });
      } catch (err) {
        setError("Login session expired.");
        navigate('/login'); 
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]); 

  // 2. Logout
  const handleLogout = async () => {
    try {
        await api.post('/auth/logout/');
    } catch (err) {
        console.error("Backend logout failed:", err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setOriginalUser(null);
      alert("Logged out successfully.");
      navigate('/login');
    }
  };
  
  // 3. Form fields 
  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  // 4. Save Button
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
        const payload = {
            username: formData.username,
            email: formData.email,
            profile: {
                dob: formData.dob || null, 
                college: formData.college,
                qualification: formData.qualification,
                roll_number: formData.roll_number,
                year: formData.year,
                course: formData.course
            }
        };

        // API call 
        await api.patch('/auth/user/', payload); 
        
       
        setOriginalUser({
            ...originalUser, 
            username: formData.username,
            email: formData.email,
            profile: payload.profile
        });

        setIsEditing(false); 
        alert("Profile updated successfully!");

    } catch (err) {
        console.error("Update failed:", err.response?.data);
        setError("Failed to update profile. Please check the fields.");
    } finally {
        setLoading(false);
    }
  };

  // 5. Cancel Button
  const handleCancel = () => {
    setIsEditing(false);
    
    setFormData({
        username: originalUser.username,
        email: originalUser.email,
        dob: originalUser.profile?.dob || '',
        college: originalUser.profile?.college || '',
        qualification: originalUser.profile?.qualification || '',
        roll_number: originalUser.profile?.roll_number || '',
        year: originalUser.profile?.year || '',
        course: originalUser.profile?.course || ''
    });
  };

  if (loading) {
    return <div className="auth-wrapper"><div className="auth-card"><p>Loading Profile...</p></div></div>;
  }
  
 
  const avatarElement = avatarUrl ? (
    <img 
        src={avatarUrl} 
        alt="Avatar" 
        style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            margin: '0 auto 1.5rem auto', objectFit: 'cover' 
        }} 
    />
  ) : (
    <div style={defaultAvatarStyle}>{getInitials(formData.username)}</div>
  );


  return (
    <div className="auth-wrapper"> 
        <div className="auth-card" style={{gridTemplateColumns: '1fr', maxWidth: '700px', padding: '2rem'}}>
          
          <div style={{textAlign: 'center'}}>
            {avatarElement}
            <h2>{isEditing ? 'Edit Profile' : 'Student Profile'}</h2>
            {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
          </div>
          
          <div className="profile-form-container">
              
              
              <div className="profile-field">
                  <label>👤 Name (Username):</label>
                  {isEditing ? (
                      <input type="text" name="username" value={formData.username} onChange={handleChange} />
                  ) : (
                      <span>{formData.username}</span>
                  )}
              </div>

              
              <div className="profile-field">
                  <label>✉️ Email:</label>
                  {isEditing ? (
                      <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  ) : (
                      <span>{formData.email}</span>
                  )}
              </div>

              
              <div className="profile-field">
                  <label>🎂 Date of Birth:</label>
                  {isEditing ? (
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                  ) : (
                      <span>{formData.dob || 'Not set'}</span>
                  )}
              </div>

              
              <div className="profile-field">
                  <label>🎓 College/School:</label>
                  {isEditing ? (
                      <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="e.g. St. Xavier's" />
                  ) : (
                      <span>{formData.college || 'Not set'}</span>
                  )}
              </div>

              
              <div className="profile-field">
                  <label>📚 Qualification:</label>
                  {isEditing ? (
                      <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. High School" />
                  ) : (
                      <span>{formData.qualification || 'Not set'}</span>
                  )}
              </div>

              
              <div className="profile-field">
                  <label>📘 Course:</label>
                  {isEditing ? (
                      <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="e.g. B.Sc IT" />
                  ) : (
                      <span>{formData.course || 'Not set'}</span>
                  )}
              </div>

              
              <div className="profile-field">
                  <label>🗓️ Year:</label>
                  {isEditing ? (
                      <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="e.g. 3rd Year" />
                  ) : (
                      <span>{formData.year || 'Not set'}</span>
                  )}
              </div>

              
              <div className="profile-field">
                  <label>#️⃣ Roll Number:</label>
                  {isEditing ? (
                      <input type="text" name="roll_number" value={formData.roll_number} onChange={handleChange} placeholder="e.g. 101" />
                  ) : (
                      <span>{formData.roll_number || 'Not set'}</span>
                  )}
              </div>


              
              <div className="profile-buttons">
                  {isEditing ? (
                      <>
                        <button className="profile-btn save" onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : '✅ Save Changes'}
                        </button>
                        <button className="profile-btn cancel" onClick={handleCancel}>❌ Cancel</button>
                      </>
                  ) : (
                      <>
                        <button className="profile-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                        <button className="profile-btn logout" onClick={handleLogout}>🚪 Logout</button>
                      </>
                  )}
              </div>
          </div>
        </div>
    </div>
  );
};

export default Profile;