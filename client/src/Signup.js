import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signup', {
                userName,
                userEmail,
                userPassword,
                userPhone
            });
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            console.error('Signup error', error.response.data);
            // Handle errors (e.g., show error message to user)
        }
    };

    return (
        <div className="signup-container">
            
            <form onSubmit={handleSubmit} className="signup-form">
            <h2>Sign Up</h2>
                <div className="input-group">
                <input
                    type="text"
                    placeholder="Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                </div>
                <div className="input-group">
                <input
                    type="email"
                    placeholder="Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                /> 
                </div>
                <div className="input-group">
                <input
                    type="password"
                    placeholder="Password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                />
                </div>
                <div className="input-group">
                <input
                    type="tel"
                    placeholder="Phone"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    required
                />
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
                <p className="login-link">
                    Already has account? <span onClick={() => navigate('/login')}>Login</span>
                </p>
            </form>
        </div>
    );
};

export default Signup;
