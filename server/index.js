const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

// Update the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demopod' // Make sure this matches your actual DB name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
    res.send('Server is running on port 5000');
});

// Update the registration endpoint
app.post('/register', (req, res) => {
    const { userName, userEmail, userPassword, userPhone } = req.body;
    const userRole = 4; // Set default user role to 4 (Customer)
    const sql = 'INSERT INTO User (userName, userEmail, userPassword, userPhone, userRole) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [userName, userEmail, userPassword, userPhone, userRole], (err, result) => {
        if (err) {
            console.error('Error in registration:', err);
            res.status(500).json({ error: 'Registration failed' });
        } else {
            res.json({ message: 'User registered successfully' });
        }
    });
});

// Update the login endpoint
app.post('/login', (req, res) => {
    const { userEmail, userPassword } = req.body;
    console.log('Login attempt:', { userEmail, userPassword });

    const sql = 'SELECT userId, userName, userEmail, CAST(userRole AS SIGNED) AS userRole, userPoint FROM User WHERE userEmail = ? AND userPassword = ?';

    db.query(sql, [userEmail, userPassword], (err, results) => {
        if (err) {
            console.error('Database error during login:', err);
            res.status(500).json({ error: 'Login failed due to server error' });
        } else if (results.length > 0) {
            console.log('User found:', results[0]);
            res.json(results[0]);
        } else {
            console.log('Invalid credentials for:', userEmail);
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Get all users
app.get('/users', (req, res) => {
    const sql = 'SELECT userId, userName, userEmail, userRole FROM User';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Error fetching users' });
        } else {
            console.log('Fetched users:', results);
            res.json(results);
        }
    });
});


// Add this new route for singular /user
app.get('/user', (req, res) => {
    res.redirect('/users');  // This will redirect /user to /users
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM User WHERE userId = ?';

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ error: 'Error deleting user' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
});

// Update a user
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { userName, userEmail, userRole } = req.body;
    console.log('Updating user:', { userId, userName, userEmail, userRole });

    const sql = 'UPDATE User SET userName = ?, userEmail = ?, userRole = ? WHERE userId = ?';

    db.query(sql, [userName, userEmail, userRole, userId], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Error updating user' });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'User updated successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        }
    });
});

// Generate reports
app.get('/reports', (req, res) => {
    const { type } = req.query;
    let sql = '';

    switch (type) {
        case 'usage':
            sql = 'SELECT COUNT(*) as count, DATE(createdAt) as date FROM Booking GROUP BY DATE(createdAt)';
            break;
        case 'peak_times':
            // Join Booking, BookingSlots, and Slot tables to get slot times
            sql = `
                    SELECT 
                        CONCAT(S.slotStartTime, ' - ', S.slotEndTime) AS slot,
                        COUNT(B.bookingId) AS count 
                    FROM 
                        Booking AS B
                    JOIN 
                        BookingSlots AS BS ON B.bookingId = BS.bookingId 
                    JOIN 
                        Slot AS S ON BS.slotId = S.slotId 
                    GROUP BY 
                        S.slotStartTime, S.slotEndTime 
                    ORDER BY 
                        count DESC 
                    LIMIT 5;
                `;
            break;

        default:
            return res.status(400).json({ error: 'Invalid report type' });
    }

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(results);
    });
});


// Get all payment methods
app.get('/payment-methods', (req, res) => {
    const sql = 'SELECT * FROM PaymentMethod';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching payment methods:', err);
            res.status(500).json({ error: 'Error fetching payment methods' });
        } else {
            console.log('Fetched payment methods:', results); // Add this line for debugging
            res.json(results);
        }
    });
});

// Add a new payment method
app.post('/payment-methods', (req, res) => {
    const { method } = req.body;
    const sql = 'INSERT INTO PaymentMethod (method) VALUES (?)';
    db.query(sql, [method], (err, result) => {
        if (err) {
            console.error('Error adding payment method:', err);
            res.status(500).json({ error: 'Error adding payment method' });
        } else {
            res.json({ message: 'Payment method added successfully', id: result.insertId });
        }
    });
});

// Update a payment method
app.put('/payment-methods/:id', (req, res) => {
    const { id } = req.params;
    const { method } = req.body;
    const sql = 'UPDATE PaymentMethod SET method = ? WHERE methodId = ?';
    db.query(sql, [method, id], (err, result) => {
        if (err) {
            console.error('Error updating payment method:', err);
            res.status(500).json({ error: 'Error updating payment method' });
        } else {
            res.json({ message: 'Payment method updated successfully' });
        }
    });
});

// Delete a payment method
app.delete('/payment-methods/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM PaymentMethod WHERE methodId = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting payment method:', err);
            res.status(500).json({ error: 'Error deleting payment method' });
        } else {
            res.json({ message: 'Payment method deleted successfully' });
        }
    });
});


app.get('/slots-info/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;

    // Fetch slot information based on bookingId
    const fetchSlotsSql = `
        SELECT slotId, slotStartTime, slotEndTime
        FROM Slot
        WHERE slotId IN (
            SELECT slotId FROM BookingSlots WHERE bookingId = ?
        )
    `;

    db.query(fetchSlotsSql, [bookingId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching slot information', error: err });
        }
        res.json(results);
    });
});

app.post('/payments', (req, res) => {
    const { bookingId, methodId, totalPrice } = req.body;

    // Validation: Check if required fields are present
    if (!bookingId || !methodId || !totalPrice) {
        return res.status(400).json({ message: 'Missing required payment details' });
    }

    // Start the transaction for inserting payment
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: 'Transaction error', error: err });
        }

        // Insert payment into Payment table
        const paymentSql = `
            INSERT INTO Payment (bookingId, methodId, totalPrice, paymentStatus, slotId)
            VALUES (?, ?, ?, 'Completed', ?)
        `;

        // Assuming you get slotId from another source or directly from the booking data
        const slotId = req.body.slotId; // Adjust this if needed

        db.query(paymentSql, [bookingId, methodId, totalPrice, slotId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    return res.status(500).json({ message: 'Error processing payment', error: err });
                });
            }

            const paymentId = result.insertId;

            // Log the transaction in the Transaction table
            const transactionSql = `
                INSERT INTO Transaction (bookingId, userId, eventDescription, transactionType, transactionAmount, transactionStatus)
                VALUES (?, ?, ?, 'Payment', ?, 'Success')
            `;
            const eventDescription = `Payment of ${totalPrice} for booking ID: ${bookingId}`;
            const userId = req.body.userId || null; // Assuming userId is passed in req.body or fetched from session/auth

            db.query(transactionSql, [bookingId, userId, eventDescription, totalPrice], (err) => {
                if (err) {
                    return db.rollback(() => {
                        return res.status(500).json({ message: 'Error logging transaction', error: err });
                    });
                }

                // Commit the transaction after both inserts
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            return res.status(500).json({ message: 'Transaction commit error', error: err });
                        });
                    }

                    // Return success response with payment and transaction details
                    res.json({ message: 'Payment processed successfully', paymentId });
                });
            });
        });
    });
});



app.get('/bookings/:bookingId/slots', (req, res) => {
    const bookingId = req.params.bookingId;

    const sql = `
        SELECT s.slotStartTime, s.slotEndTime 
        FROM Payment p
        JOIN Slot s ON p.slotId = s.slotId
        WHERE p.bookingId = ?
    `;

    db.query(sql, [bookingId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching slot information', error: err });
        }

        if (results.length > 0) {
            res.json(results[0]); // Send the first slot information
        } else {
            res.status(404).json({ message: 'No slot information found for this booking' });
        }
    });
});



// Get all transactions
app.get('/transactions', (req, res) => {
    const sql = 'SELECT * FROM Transaction ORDER BY eventDate DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            res.status(500).json({ message: 'Error fetching transactions' });
        } else {
            res.json(results);
        }
    });
});

// Add a new transaction
app.post('/transactions', (req, res) => {
    const { bookingId, userId, eventDescription, transactionType, transactionAmount, transactionStatus } = req.body;
    const sql = 'INSERT INTO Transaction (bookingId, userId, eventDescription, transactionType, transactionAmount, transactionStatus) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [bookingId, userId, eventDescription, transactionType, transactionAmount, transactionStatus], (err, result) => {
        if (err) {
            console.error('Error adding transaction:', err);
            res.status(500).json({ message: 'Error adding transaction' });
        } else {
            res.status(201).json({ transactionId: result.insertId, message: 'Transaction added successfully' });
        }
    });
});

// Update a transaction
app.put('/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { eventDescription, transactionType, transactionAmount, transactionStatus } = req.body;
    const sql = 'UPDATE Transaction SET eventDescription = ?, transactionType = ?, transactionAmount = ?, transactionStatus = ? WHERE transactionId = ?';
    db.query(sql, [eventDescription, transactionType, transactionAmount, transactionStatus, id], (err, result) => {
        if (err) {
            console.error('Error updating transaction:', err);
            res.status(500).json({ message: 'Error updating transaction' });
        } else {
            res.json({ message: 'Transaction updated successfully' });
        }
    });
});

// Delete a transaction
app.delete('/transactions/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Transaction WHERE transactionId = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting transaction:', err);
            res.status(500).json({ message: 'Error deleting transaction' });
        } else {
            res.json({ message: 'Transaction deleted successfully' });
        }
    });
});

// Get all rooms
app.get('/rooms', (req, res) => {
    const sql = 'SELECT * FROM Room';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            res.status(500).json({ error: 'Error fetching rooms' });
        } else {
            res.json(results);
        }
    });
});

// Add a new room
app.post('/rooms', (req, res) => {
    const { roomName, roomType, roomDescription, roomStatus } = req.body;
    const sql = 'INSERT INTO Room (roomName, roomType, roomDescription, roomStatus) VALUES (?, ?, ?, ?)';
    db.query(sql, [roomName, roomType, roomDescription, roomStatus], (err, result) => {
        if (err) {
            console.error('Error adding room:', err);
            res.status(500).json({ error: 'Error adding room' });
        } else {
            res.json({ message: 'Room added successfully', id: result.insertId });
        }
    });
});

// Update a room
app.put('/rooms/:id', (req, res) => {
    const { id } = req.params;
    const { roomName, roomType, roomDescription, roomStatus } = req.body;
    const sql = 'UPDATE Room SET roomName = ?, roomType = ?, roomDescription = ?, roomStatus = ? WHERE roomId = ?';
    db.query(sql, [roomName, roomType, roomDescription, roomStatus, id], (err, result) => {
        if (err) {
            console.error('Error updating room:', err);
            res.status(500).json({ error: 'Error updating room' });
        } else {
            res.json({ message: 'Room updated successfully' });
        }
    });
});

// Delete a room
app.delete('/rooms/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Room WHERE roomId = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting room:', err);
            res.status(500).json({ error: 'Error deleting room' });
        } else {
            res.json({ message: 'Room deleted successfully' });
        }
    });
});

// Get all bookings
app.get('/bookings', (req, res) => {
    const sql = `
        SELECT b.bookingId, b.userId, b.roomId, b.bookingStartDay, b.bookingEndDay, b.totalPrice, 
               b.bookingStatus, b.createdAt, 
               r.roomName, 
               GROUP_CONCAT(CONCAT(s.slotStartTime, ' - ', s.slotEndTime) ORDER BY s.slotStartTime SEPARATOR ', ') AS slots
        FROM Booking b
        JOIN Room r ON b.roomId = r.roomId
        JOIN BookingSlots bs ON b.bookingId = bs.bookingId
        JOIN Slot s ON bs.slotId = s.slotId
        JOIN User u ON b.userId = u.userId
        GROUP BY b.bookingId
        ORDER BY b.createdAt DESC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            res.status(500).json({ error: 'Error fetching bookings' });
        } else {
            res.json(results);
        }
    });
});





app.put('/bookings/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    const { bookingStatus } = req.body;

    // Fetch the original booking status
    const getBookingSql = 'SELECT bookingStatus, userId FROM Booking WHERE bookingId = ?';
    db.query(getBookingSql, [bookingId], (err, bookingResult) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (bookingResult.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const originalStatus = bookingResult[0].bookingStatus;
        const userId = bookingResult[0].userId;

        // Update booking status
        const updateSql = 'UPDATE Booking SET bookingStatus = ? WHERE bookingId = ?';
        db.query(updateSql, [bookingStatus, bookingId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Log the change in the Transaction table
            const transactionSql = `
                INSERT INTO Transaction (bookingId, userId, eventDescription, transactionType, eventDate, transactionStatus)
                VALUES (?, ?, ?, ?, NOW(), ?)
            `;
            const eventDescription = `Booking status changed from ${originalStatus} to ${bookingStatus}`;
            const transactionType = 'Status Change';
            const transactionStatus = bookingStatus; // Assuming the new status is the transaction status

            db.query(transactionSql, [bookingId, userId, eventDescription, transactionType, transactionStatus], (err, transactionResult) => {
                if (err) {
                    return res.status(500).json({ error: 'Error logging transaction' });
                }

                res.status(200).json({ message: 'Booking status updated and transaction logged successfully' });
            });
        });
    });
});



// Get all slots
app.get('/slots', (req, res) => {
    const sql = 'SELECT * FROM Slot';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching slots:', err);
            res.status(500).json({ error: 'Error fetching slots' });
        } else {
            res.json(results);
        }
    });
});

// Get all services
app.get('/services', (req, res) => {
    const sql = 'SELECT * FROM Services';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching services:', err);
            res.status(500).json({ error: 'Error fetching services' });
        } else {
            res.json(results);
        }
    });
});

//Get Pending Services
app.get('/services/pending', (req, res) => {
    const query = `
        SELECT s.serviceId, u.userName, r.roomName, bs.slotId, s.serviceName, s.servicePrice, s.serviceStatus
        FROM Services s
        JOIN Booking b ON s.bookingId = b.bookingId
        JOIN User u ON b.userId = u.userId
        JOIN Room r ON b.roomId = r.roomId
        JOIN BookingSlots bs ON b.bookingId = bs.bookingId
        WHERE s.serviceStatus = 'Pending';

    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Failed to fetch pending services' });
        }
        res.json(results);
    });
});




app.get('/bookings/confirmed', (req, res) => {
    const query = `
        SELECT DISTINCT b.bookingId, b.userId, b.roomId, b.bookingStartDay, b.bookingEndDay,
               b.totalPrice, b.bookingStatus, b.createdAt, u.userPoint,
               r.roomName
        FROM Booking b
        JOIN User u ON b.userId = u.userId
        JOIN Room r ON b.roomId = r.roomId
        WHERE b.bookingStatus = 'Confirmed';
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Failed to fetch confirmed bookings' });
        }
        res.json(results);
    });
});







// Update service status
app.put('/services/:serviceId', (req, res) => {
    const { serviceStatus } = req.body;
    const { serviceId } = req.params;
    const query = 'UPDATE Services SET serviceStatus = ? WHERE serviceId = ?';
    db.query(query, [serviceStatus, serviceId], (error, results) => {
        if (error) return res.status(500).json({ error: 'Failed to update service status' });
        res.json({ message: 'Service status updated successfully' });
    });
});


// Update booking status
app.put('/bookings/:bookingId', (req, res) => {
    const { bookingStatus } = req.body;
    const { bookingId } = req.params;
    const query = 'UPDATE Booking SET bookingStatus = ? WHERE bookingId = ?';
    db.query(query, [bookingStatus, bookingId], (error, results) => {
        if (error) return res.status(500).json({ error: 'Failed to update booking status' });
        res.json({ message: 'Booking status updated successfully' });
    });
});




app.post('/available-rooms', (req, res) => {
    const { date, slotIds } = req.body;

    // Generate placeholders for slot IDs
    const placeholders = slotIds.map(() => '?').join(',');

    const sql = `
        SELECT DISTINCT r.roomId, r.roomName, s.slotPrice
        FROM Room r
        JOIN Slot s ON s.slotId IN (${placeholders})
        WHERE r.roomStatus = 'Available'
        AND NOT EXISTS (
            SELECT 1
            FROM Booking b
            JOIN BookingSlots bs2 ON b.bookingId = bs2.bookingId
            JOIN Slot s2 ON s2.slotId = bs2.slotId
            WHERE b.roomId = r.roomId
            AND b.bookingStartDay = ?
            AND s2.slotId IN (${placeholders})
        )
    `;

    const bookingDate = new Date(date).toISOString().split('T')[0]; // Format the date correctly

    // Spread slotIds twice for both the main query and the subquery
    db.query(sql, [...slotIds, bookingDate, ...slotIds], (err, results) => {
        if (err) {
            console.error('Error fetching available rooms:', err);
            res.status(500).json({ error: 'Error fetching available rooms' });
        } else {
            res.json(results);
        }
    });
});








app.post('/bookings', (req, res) => {
    const { userId, roomId, selectedDate, selectedSlots, totalPrice } = req.body;

    // Check for required fields
    if (!userId || !roomId || !selectedDate || !selectedSlots || selectedSlots.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert selectedDate to the appropriate format for booking
    const bookingStartDay = selectedDate;
    const bookingEndDay = selectedDate; // Assuming single-day booking

    // Start the transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: 'Transaction error', error: err });
        }

        // Insert the booking with totalPrice
        const bookingSql = `
            INSERT INTO Booking (userId, roomId, bookingStartDay, bookingEndDay, totalPrice, bookingStatus)
            VALUES (?, ?, ?, ?, ?, 'Pending')
        `;
        db.query(bookingSql, [userId, roomId, bookingStartDay, bookingEndDay, totalPrice], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    return res.status(500).json({ message: 'Error inserting booking', error: err });
                });
            }

            const bookingId = result.insertId;

            // Insert selected slots into BookingSlots
            const bookingSlotsSql = `
                INSERT INTO BookingSlots (bookingId, slotId)
                VALUES ?
            `;
            const slotsValues = selectedSlots.map(slotId => [bookingId, slotId]);

            db.query(bookingSlotsSql, [slotsValues], (err) => {
                if (err) {
                    return db.rollback(() => {
                        return res.status(500).json({ message: 'Error inserting booking slots', error: err });
                    });
                }

                // Commit the transaction after all queries are successful
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            return res.status(500).json({ message: 'Transaction commit error', error: err });
                        });
                    }
                    res.json({ message: 'Booking created successfully', bookingId, totalPrice });
                });
            });
        });
    });
});







// Add this endpoint to your server
app.post('/feedback', (req, res) => {
    const { bookingId, rating, feedback } = req.body;
    const userId = req.user.userId; // Assuming you have user authentication middleware

    const sql = `
        INSERT INTO Feedback (bookingId, userId, rating, feedback)
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [bookingId, userId, rating, feedback], (err, result) => {
        if (err) {
            console.error('Error submitting feedback:', err);
            res.status(500).json({ error: 'Error submitting feedback' });
        } else {
            // Add reward points to the user
            const addPointsSql = 'UPDATE User SET userPoint = userPoint + 10 WHERE userId = ?';
            db.query(addPointsSql, [userId], (err, result) => {
                if (err) {
                    console.error('Error adding reward points:', err);
                }
                res.json({ message: 'Feedback submitted and reward points added successfully' });
            });
        }
    });
});

app.get('/bookings/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT * FROM Booking
        WHERE userId = ?
        ORDER BY createdAt DESC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user bookings:', err);
            res.status(500).json({ error: 'Error fetching user bookings' });
        } else {
            res.json(results);
        }
    });
});


// Add this new endpoint to fetch a single user's profile
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT userId, userName, userEmail, userPhone, userPoint FROM User WHERE userId = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            res.status(500).json({ error: 'Error fetching user profile' });
        } else if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { userName, userEmail, userPhone } = req.body;
    const sql = 'UPDATE User SET userName = ?, userEmail = ?, userPhone = ? WHERE userId = ?';

    db.query(sql, [userName, userEmail, userPhone, userId], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Error updating user' });
        } else {
            res.json({ message: 'User updated successfully' });
        }
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});



