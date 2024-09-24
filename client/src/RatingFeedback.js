import React, { useState } from 'react';
import axios from 'axios';

const RatingFeedback = ({ bookingId }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/feedback', { bookingId, rating, feedback });
            alert('Thank you for your feedback! You have earned reward points.');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Rate Your Experience</h2>
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => setRating(star)}
                        style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}
                    >
                        ★
                    </span>
                ))}
            </div>
            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Leave your feedback here"
            />
            <button type="submit">Submit Feedback</button>
        </form>
    );
};

export default RatingFeedback;