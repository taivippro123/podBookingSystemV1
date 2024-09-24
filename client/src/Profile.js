import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Profile.css'; // Make sure to create this CSS file

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData && userData.userId) {
                const response = await axios.get(`http://localhost:5000/users/${userData.userId}`);
                setUser(response.data);
                setEditedUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/users/${user.userId}`, editedUser);
            setUser(editedUser);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleCancel = () => {
        setEditedUser(user);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="content">
                <div className="profile-box">
                    <h2>User Profile</h2>
                    {user && (
                        <div className="profile-info">
                            {isEditing ? (
                                <>
                                    <input
                                        name="userName"
                                        value={editedUser.userName}
                                        onChange={handleChange}
                                        placeholder="Name"
                                    />
                                    <input
                                        name="userEmail"
                                        value={editedUser.userEmail}
                                        onChange={handleChange}
                                        placeholder="Email"
                                    />
                                    <input
                                        name="userPhone"
                                        value={editedUser.userPhone}
                                        onChange={handleChange}
                                        placeholder="Phone"
                                    />
                                    <div className="points">Points: {user.userPoint}</div>
                                    <div className="edit-buttons">
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div><strong>Name:</strong> {user.userName}</div>
                                    <div><strong>Email:</strong> {user.userEmail}</div>
                                    <div><strong>Phone:</strong> {user.userPhone}</div>
                                    <div><strong>Points:</strong> {user.userPoint}</div>
                                    <button onClick={handleEdit}>Edit Profile</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;