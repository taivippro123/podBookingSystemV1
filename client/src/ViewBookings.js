import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './ViewBookings.css';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Confirmed');

    useEffect(() => {
        fetchUserBookings();
    }, []);

    const fetchUserBookings = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData && userData.userId) {
                const response = await axios.get(`http://localhost:5000/bookings/${userData.userId}`);
                setBookings(response.data);
            }
        } catch (error) {
            console.error('Error fetching user bookings:', error);
        }
    };

    const renderBookings = () => {
        const categories = ['Cancelled', 'Pending', 'Confirmed', 'Using', 'Checked Out', 'Completed'];

        return (
            <>
                <div className="booking-tabs">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`tab-button ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="booking-category">
                    <h3>{activeCategory}</h3>
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Room ID</th>
                                <th>Start Day</th>
                                <th>End Day</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.filter(booking => booking.bookingStatus === activeCategory).map(booking => (
                                <tr key={booking.bookingId}>
                                    <td>{booking.bookingId}</td>
                                    <td>{booking.roomId}</td>
                                    <td>{new Date(booking.bookingStartDay).toLocaleDateString()}</td>
                                    <td>{new Date(booking.bookingEndDay).toLocaleDateString()}</td>
                                    <td>
                                        {booking.totalPrice !== null
                                            ? `$${booking.totalPrice.toFixed(2)}`
                                            : 'N/A'}
                                    </td>
                                    <td>{booking.bookingStatus}</td>
                                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.filter(booking => booking.bookingStatus === activeCategory).length === 0 && (
                        <p>No {activeCategory.toLowerCase()} bookings.</p>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="view-bookings-page">
            <Navbar />
            <div className="content">
                <h1>Your Bookings</h1>
                <div className="bookings-container">
                    {renderBookings()}
                </div>
            </div>
        </div>
    );
};

export default ViewBookings;
