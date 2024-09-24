import React, { useState } from 'react';
import Navbar from './Navbar';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to your server
    console.log('Form submitted:', { name, email, message });
    // Reset form fields
    setName('');
    setEmail('');
    setMessage('');
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <div className="contact-page">
      <Navbar />
      <div className="contact-content">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Please fill out the form below or use our contact information.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
            ></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>

        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>Email: info@podbooking.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Pod Street, City, Country, ZIP</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;