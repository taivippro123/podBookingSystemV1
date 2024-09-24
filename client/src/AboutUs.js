import React from 'react';
import Navbar from './Navbar';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <Navbar />
      <div className="about-us-content">
        <h1>About Us</h1>
        <p>Welcome to our Pod Booking System! We are dedicated to providing a seamless and efficient experience for all your pod booking needs.</p>
        
        <h2>Our Mission</h2>
        <p>Our mission is to revolutionize the way people work and collaborate by offering flexible, comfortable, and technologically advanced pod spaces.</p>
        
        <h2>Our Story</h2>
        <p>Founded in 2023, our company started with a simple idea: to create a space where individuals and teams could work productively in a modern, adaptable environment. Since then, we've grown to multiple locations, serving thousands of satisfied customers.</p>
        
        <h2>Why Choose Us?</h2>
        <ul>
          <li>State-of-the-art pod facilities</li>
          <li>Flexible booking options</li>
          <li>24/7 customer support</li>
          <li>Competitive pricing</li>
          <li>Convenient locations</li>
        </ul>
        
        <h2>Our Team</h2>
        <p>Our dedicated team of professionals works tirelessly to ensure that your pod booking experience is smooth and enjoyable. From our customer service representatives to our maintenance staff, we're all committed to providing you with the best possible service.</p>
      </div>
    </div>
  );
};

export default AboutUs;