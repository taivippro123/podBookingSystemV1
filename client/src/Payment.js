import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css'; // Import the CSS file
import Navbar from './Navbar';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Define navigate here
    const { bookingId, totalPrice, room, services } = location.state || {};
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [slotInfo, setSlotInfo] = useState([]);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get('http://localhost:5000/payment-methods');
                setPaymentMethods(response.data);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
            }
        };

        const fetchSlotInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/slots-info/${bookingId}`);
                setSlotInfo(response.data);
            } catch (error) {
                console.error('Error fetching slot information:', error);
            }
        };

        fetchPaymentMethods();
        fetchSlotInfo();
    }, [bookingId]);

    const handlePayment = async (methodId) => {
        try {
            const paymentData = {
                bookingId,
                methodId,
                totalPrice,
                slotId: slotInfo[0]?.slotId // Assuming you want the first slotId if multiple are returned
            };

            const response = await axios.post('http://localhost:5000/payments', paymentData);
            alert('Payment successful! Check your Pending tab in your bookings! Transaction ID: ' + response.data.paymentId);
            navigate('/bookings'); // Navigate after payment success
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Failed to process payment. Please try again.');
        }
    };

    return (
        <div className="payment-page">
            <Navbar />
            <h1>Payment</h1>
            <div className="booking-info">
                <h2>Booking Information</h2>
                <p>Room: {room?.roomName}</p>
                <p>Total Price: ${totalPrice}</p>
                <p>Time:</p>
                {slotInfo.map(slot => (
                    <p key={slot.slotId}>{slot.slotStartTime} - {slot.slotEndTime}</p>
                ))}
            </div>
            <div className="payment-methods">
                <h2>Select Payment Method</h2>
                <ul>
                    {paymentMethods.map(method => (
                        <li key={method.methodId}>
                            <button onClick={() => handlePayment(method.methodId)}>{method.method}</button>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Payment;
