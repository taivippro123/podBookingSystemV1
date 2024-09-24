import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './ManagerPage.css';

const ManagerPage = () => {
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeView, setActiveView] = useState('rooms');
    const [newRoom, setNewRoom] = useState({ roomName: '', roomType: '', roomDescription: '', roomStatus: '' });
    const [editingRoom, setEditingRoom] = useState(null);

    useEffect(() => {
        fetchRooms();
        fetchBookings();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleRoomChange = (e, room = null) => {
        if (room) {
            setEditingRoom({ ...room, [e.target.name]: e.target.value });
        } else {
            setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
        }
        
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/rooms', newRoom);
            fetchRooms();
            setNewRoom({ roomName: '', roomType: '', roomDescription: '', roomStatus: '' });
            alert('Room created successfully!');
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Failed to create room. Please try again.');
        }
    };

    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/rooms/${editingRoom.roomId}`, editingRoom);
            fetchRooms();
            setEditingRoom(null);
            alert('Room updated successfully!');
        } catch (error) {
            console.error('Error updating room:', error);
            alert('Failed to update room. Please try again.');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await axios.delete(`http://localhost:5000/rooms/${roomId}`);
                fetchRooms();
                alert('Room deleted successfully!');
            } catch (error) {
                console.error('Error deleting room:', error);
                alert('Failed to delete room. Please try again.');
            }
        }
    };

    const handleBookingStatusChange = async (bookingId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/bookings/${bookingId}`, { bookingStatus: newStatus });
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    const renderRooms = () => (
        <div className="rooms-container">
            <h2>Create New Room</h2>
            <form onSubmit={handleCreateRoom} className="room-form">
                <input name="roomName" value={newRoom.roomName} onChange={handleRoomChange} placeholder="Room Name" required />
                <input name="roomType" value={newRoom.roomType} onChange={handleRoomChange} placeholder="Room Type" required />
                <textarea name="roomDescription" value={newRoom.roomDescription} onChange={handleRoomChange} placeholder="Room Description" required />
                <select name="roomStatus" value={newRoom.roomStatus} onChange={handleRoomChange}>
                    <option value={1}>Available</option>
                    <option value={0}>Unavailable</option>
                </select>
                <button type="submit">Create Room</button>
            </form>

            <h2>Rooms</h2>
            <table className="rooms-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(room => (
                        <tr key={room.roomId}>
                            <td>{editingRoom && editingRoom.roomId === room.roomId ? 
                                <input name="roomName" value={editingRoom.roomName} onChange={(e) => handleRoomChange(e, room)} /> : 
                                room.roomName}
                            </td>
                            <td>{editingRoom && editingRoom.roomId === room.roomId ? 
                                <input name="roomType" value={editingRoom.roomType} onChange={(e) => handleRoomChange(e, room)} /> : 
                                room.roomType}
                            </td>
                            <td>{editingRoom && editingRoom.roomId === room.roomId ? 
                                <textarea name="roomDescription" value={editingRoom.roomDescription} onChange={(e) => handleRoomChange(e, room)} /> : 
                                room.roomDescription}
                            </td>
                            <td>{editingRoom && editingRoom.roomId === room.roomId ? (
                                <select name="roomStatus" value={editingRoom.roomStatus} onChange={(e) => handleRoomChange(e, room)}>
                                    <option value="Available">Available</option>
                                    <option value="Unavailable">Unavailable</option>
                                </select>
                            ) : (room.roomStatus)}
                            </td>

                            <td>

                                {editingRoom && editingRoom.roomId === room.roomId ? (
                                    <>
                                        <button onClick={handleUpdateRoom}>Save</button>
                                        <button onClick={() => setEditingRoom(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setEditingRoom(room)}>Edit</button>
                                        <button onClick={() => handleDeleteRoom(room.roomId)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderBookings = () => (
        <table className="bookings-table">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>User ID</th>
                    <th>Room Name</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(booking => (
                    <tr key={booking.bookingId}>
                        <td>{booking.bookingId}</td>
                        <td>{booking.userId}</td>
                        <td>{booking.roomName}</td>
                        <td>{new Date(booking.bookingStartDay).toLocaleString()}</td>
                        <td>{new Date(booking.bookingEndDay).toLocaleString()}</td>
                        <td>${booking.totalPrice}</td>
                        <td>{booking.bookingStatus}</td>
                        <td>
                            <select 
                                value={booking.bookingStatus} 
                                onChange={(e) => handleBookingStatusChange(booking.bookingId, e.target.value)}
                                className={`status-${booking.bookingStatus.toLowerCase().replace(' ', '-')}`}
                            >
                                <option value="Cancelled">Cancelled</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Using">Using</option>
                                <option value="Checked Out">Checked Out</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="manager-page">
            <Navbar />
            <div className="manager-dashboard">
                <div className="sidebar">
                    <h2>Manager Dashboard</h2>
                    <ul>
                        <li 
                            className={activeView === 'rooms' ? 'active' : ''}
                            onClick={() => setActiveView('rooms')}
                        >
                            View Rooms
                        </li>
                        <li 
                            className={activeView === 'bookings' ? 'active' : ''}
                            onClick={() => setActiveView('bookings')}
                        >
                            View Bookings
                        </li>
                    </ul>
                </div>
                <div className="main-content">
                    <h1>{activeView === 'rooms' ? 'Rooms' : 'Bookings'}</h1>
                    {activeView === 'rooms' ? renderRooms() : renderBookings()}
                </div>
            </div>
        </div>
    );
};

export default ManagerPage;
