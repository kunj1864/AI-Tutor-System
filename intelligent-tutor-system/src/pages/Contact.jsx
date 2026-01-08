// src/pages/Contact.jsx
import React, { useState } from 'react';
import '../styles/Contact.css'; 
import '../styles/Global.css';

const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg({ type: '', text: '' });

    const data = {
      access_key: "a1360ed7-8e0b-4c74-92b6-125c2f46628c", 
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setResponseMsg({ type: "success", text: "✅ Message sent successfully! We'll get in touch soon." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setResponseMsg({ type: "error", text: "❌ Failed to send message. Please try again." });
      }
    } catch (error) {
      setResponseMsg({ type: "error", text: "⚠️ Something went wrong. Please try later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <h1 className="contact-main-title">Get in touch today!</h1>

      <div className="contact-card">

        {/* --- Left Column: Contact Info --- */}
        <div className="contact-details">
          <h2>Contact Details</h2>
          <div className="contact-info-item">
            <div className="contact-icon">📍</div>
            <div className="contact-info-text">
              <h4>Find Us</h4>
              <p>Ahmedabad, Gujarat</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon">📞</div>
            <div className="contact-info-text">
              <h4>Phone</h4>
              <p>+91 74348 25645</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon">⏰</div>
            <div className="contact-info-text">
              <h4>Working Hours</h4>
              <p>Mon-Fri: 9 AM - 6 PM</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon">✉️</div>
            <div className="contact-info-text">
              <h4>Write to Us</h4>
              <p>info@aitutor.com</p>
            </div>
          </div>
        </div>

        {/* --- Right Column: Form --- */}
        <div className="contact-form">
          <h2>Have A Question?</h2>

          <form onSubmit={handleSubmit}>
           
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="subject" value="New Contact Form Submission - AI Tutor" />

            <div className="form-group">
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <textarea 
              name="message" 
              placeholder="Your Message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            
            <button type="submit" className="contact-send-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>

            {responseMsg.text && (
              <p style={{ 
                color: responseMsg.type === 'success' ? 'green' : 'red', 
                marginTop: '1rem',
                fontWeight: 'bold',
                background: responseMsg.type === 'success' ? '#e6ffed' : '#ffe6e6',
                border: `1px solid ${responseMsg.type === 'success' ? 'green' : 'red'}`,
                padding: '10px',
                borderRadius: '8px'
              }}>
                {responseMsg.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
