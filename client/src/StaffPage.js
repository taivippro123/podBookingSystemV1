import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useLogout from './useLogout';
import Navbar from './Navbar';
import './StaffPage.css';

function StaffPage() {
    const logout = useLogout();
    const [activeSection, setActiveSection] = useState('pendingServices');
    const [pendingServices, setPendingServices] = useState([]);
    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await fetchPendingServices();
            await fetchConfirmedBookings();
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchPendingServices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/services/pending');
            setPendingServices(response.data);
        } catch (error) {
            console.error('Error fetching pending services:', error.response ? error.response.data : error.message);
            setError('Failed to fetch pending services');
        }
    };

    const fetchConfirmedBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/bookings/confirmed');
            setConfirmedBookings(response.data);
        } catch (error) {
            console.error('Error fetching confirmed bookings:', error);
            setError('Failed to fetch confirmed bookings');
        }
    };

    const updateServiceStatus = async (serviceId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/services/${serviceId}`, { serviceStatus: newStatus });
            fetchPendingServices(); // Refresh pending services
        } catch (error) {
            console.error('Error updating service status:', error);
            setError('Failed to update service status');
        }
    };

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/bookings/${bookingId}`, { bookingStatus: newStatus });
            fetchConfirmedBookings(); // Refresh confirmed bookings
        } catch (error) {
            console.error('Error updating booking status:', error);
            setError('Failed to update booking status');
        }
    };

    const renderConfirmedBookings = () => (
        <div className="booking-category">
            <h3>Upcoming Bookings</h3>
            <table className="bookings-table">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>User ID</th>
                        <th>Room ID</th>
                        <th>Start Day</th>
                        <th>End Day</th>
                        <th>Total Price</th>
                        <th>Booking Status</th>
                        <th>Created At</th>
                        <th>User Points</th>
                        <th>Room Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {confirmedBookings.length > 0 ? (
                        confirmedBookings.map(booking => (
                            <tr key={booking.bookingId}>
                                <td>{booking.bookingId}</td>
                                <td>{booking.userId}</td>
                                <td>{booking.roomId}</td>
                                <td>{new Date(booking.bookingStartDay).toLocaleString()}</td>
                                <td>{new Date(booking.bookingEndDay).toLocaleString()}</td>
                                <td>${booking.totalPrice}</td>
                                <td>{booking.bookingStatus}</td>
                                <td>{new Date(booking.createdAt).toLocaleString()}</td>
                                <td>{booking.userPoint}</td>
                                <td>{booking.roomName}</td>
                                <td>
                                    <select
                                        value={booking.bookingStatus}
                                        onChange={(e) => updateBookingStatus(booking.bookingId, e.target.value)}
                                    >
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Using">Using</option>
                                        <option value="Checked Out">Checked Out</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No confirmed bookings found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="staff-page">
            <Navbar />
            <div className="staff-dashboard">
                <div className="sidebar">
                    <h2>Staff Dashboard</h2>
                    <ul>
                        <li
                            className={activeSection === 'pendingServices' ? 'active' : ''}
                            onClick={() => setActiveSection('pendingServices')}
                        >
                            Pending Services
                        </li>
                        <li
                            className={activeSection === 'viewBookings' ? 'active' : ''}
                            onClick={() => setActiveSection('viewBookings')}
                        >
                            View Upcoming Bookings
                        </li>
                    </ul>
                </div>
                <div className="main-content">
                    {activeSection === 'pendingServices' && (
                        <div className="section">
                            <h2>Pending Services</h2>
                            {pendingServices.length === 0 ? (
                                <p>No pending services found.</p>
                            ) : (
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Service ID</th>
                                                <th>User Name</th>
                                                <th>Room Name</th>
                                                <th>Slot ID</th>
                                                <th>Service Name</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingServices.length > 0 ? (
                                                pendingServices.map(service => (
                                                    <tr key={service.serviceId}>
                                                        <td>{service.serviceId}</td>
                                                        <td>{service.userName}</td>
                                                        <td>{service.roomName}</td>
                                                        <td>{service.slotId}</td>
                                                        <td>{service.serviceName}</td>
                                                        <td>${service.servicePrice}</td>
                                                        <td>{service.serviceStatus}</td>
                                                        <td>
                                                            <select
                                                                value={service.serviceStatus}
                                                                onChange={(e) => updateServiceStatus(service.serviceId, e.target.value)}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Completed">Completed</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8">No pending services found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                    {activeSection === 'viewBookings' && (
                        <div className="section">
                            <h2>View Upcoming Bookings</h2>
                            {renderConfirmedBookings()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StaffPage;
