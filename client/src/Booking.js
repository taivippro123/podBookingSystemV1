
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Booking.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Booking = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await axios.get('http://localhost:5000/slots');
                setSlots(response.data);
            } catch (error) {
                console.error('Error fetching slots:', error);
            }
        };

        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/services');
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchSlots();
        fetchServices();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setAvailableRooms([]);
        setSelectedSlots([]);
        setSelectedRoom(null);
    };

    const handleSlotSelect = (slotId) => {
        setSelectedSlots((prev) =>
            prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
        );
    };

    const fetchAvailableRooms = async () => {
        if (selectedSlots.length === 0) {
            alert('Please select at least one time slot.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/available-rooms', {
                date: selectedDate.toISOString().split('T')[0],
                slotIds: selectedSlots,
            });
            // Remove duplicate rooms based on roomId
            const uniqueRooms = Array.from(new Set(response.data.map(room => room.roomId)))
                .map(id => response.data.find(room => room.roomId === id));
            setAvailableRooms(uniqueRooms);
        } catch (error) {
            console.error('Error fetching available rooms:', error);
        }
    };

    const handleBooking = async () => {
        if (!selectedRoom || selectedSlots.length === 0) {
            alert('Please select a room and at least one slot to book.');
            return;
        }

        const bookingData = {
            roomId: selectedRoom.roomId,
            selectedSlots, // Array of selected slot IDs
            services: selectedServices, // Array of selected service IDs
            selectedDate: selectedDate.toISOString().split('T')[0], // Send selectedDate
            totalPrice: calculateTotalPrice()
        };

        console.log('Booking data being sent:', bookingData); // Log the payload for debugging

        let user;
        try {
            user = JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return;
        }

        const userId = user?.userId;

        if (!userId) {
            alert('You need to be logged in to make a booking.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/bookings', { ...bookingData, userId });
            alert('Booking successful! Booking ID: ' + response.data.bookingId);

            // Navigate to Payment.js with booking details
            navigate('/payment', {
                state: {
                    bookingId: response.data.bookingId,
                    totalPrice: calculateTotalPrice(),
                    room: selectedRoom,
                    services: selectedServices
                }
            });
        } catch (error) {
            console.error('Error creating booking:', error.response ? error.response.data : error);
            alert('Failed to create booking. Please try again.');
        }
    };








    const calculateTotalPrice = () => {
        let total = 0;
        if (selectedRoom) {
            // Include room price multiplied by the number of selected slots
            total += parseFloat(selectedRoom.slotPrice) * selectedSlots.length || 0;
        }
        selectedServices.forEach(serviceId => {
            const service = services.find(s => s.serviceId === serviceId);
            if (service) {
                total += parseFloat(service.servicePrice) || 0;
            }
            const totalPrice = total.toFixed(2);
        });
        return total.toFixed(2);
    };

    return (
        <div className="booking-page">
            <Navbar />
            <div className="booking-container">
                <h1>Book a Room</h1>
                <h2>Select Date</h2>
                <DatePicker selected={selectedDate} onChange={handleDateChange} minDate={new Date()} />

                <div className="form-group">
                    <h2>Select Time Slots</h2>
                    <div className="slot-buttons">
                        {slots.map(slot => (
                            <label key={slot.slotId}>
                                <input
                                    type="checkbox"
                                    checked={selectedSlots.includes(slot.slotId)}
                                    onChange={() => handleSlotSelect(slot.slotId)}
                                />
                                {slot.slotStartTime} - {slot.slotEndTime}
                            </label>
                        ))}
                    </div>
                </div>

                <button onClick={fetchAvailableRooms} className="fetch-rooms-button">
                    Show Available Rooms
                </button>

                <div className="form-group">
                    <h2>Available Rooms</h2>
                    <ul>
                        {availableRooms.map(room => (
                            <li key={room.roomId}>
                                <span>{room.roomName} - ${room.slotPrice}</span>
                                <button onClick={() => setSelectedRoom(room)}>
                                    {selectedRoom?.roomId === room.roomId ? 'Selected' : 'Select Room'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="form-group">
                    <h2>Select Services</h2>
                    <div className="service-checkboxes">
                        {services.map(service => (
                            <label key={service.serviceId}>
                                <span>{service.serviceName} - ${service.servicePrice}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedServices.includes(service.serviceId)}
                                    onChange={() => {
                                        setSelectedServices(prev =>
                                            prev.includes(service.serviceId)
                                                ? prev.filter(id => id !== service.serviceId)
                                                : [...prev, service.serviceId]
                                        );
                                    }}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <h2>Total Price: ${calculateTotalPrice()}</h2>
                <button onClick={handleBooking} className="book-button">
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default Booking;