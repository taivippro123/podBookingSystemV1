import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './AdminPage.css';

const AdminPage = () => {
    const [activeSection, setActiveSection] = useState('userManagement');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [filterRole, setFilterRole] = useState('all');
    const [reportType, setReportType] = useState('usage');
    const [reportData, setReportData] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [newPaymentMethod, setNewPaymentMethod] = useState('');
    const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
    const [showReportSubFunctions, setShowReportSubFunctions] = useState(false);

    const toggleReportSubFunctions = () => {
        setShowReportSubFunctions(!showReportSubFunctions);
    };

    useEffect(() => {
        fetchUsers();
        fetchPaymentMethods();
        fetchTransactions();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, filterRole]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (filterRole === 'all') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(user => user.userRole === parseInt(filterRole)));
        }
        setCurrentPage(1);
    };

    const handleUpdate = (user) => {
        setCurrentUser(user);
        setUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (updatedUser) => {
        try {
            await axios.put(`http://localhost:5000/users/${updatedUser.userId}`, updatedUser);
            setUpdateModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const generateReport = async (type) => {
        try {
            const response = await axios.get(`http://localhost:5000/reports?type=${type}`);
            console.log('Received report data:', response.data); // Debugging log
            setReportData(response.data);
            setReportType(type);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error generating report. Please try again.');
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const response = await axios.get('http://localhost:5000/payment-methods');
            console.log('Received payment methods:', response.data); // Add this line for debugging
            setPaymentMethods(response.data);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            setPaymentMethods([]); // Set to empty array in case of error
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/transactions');
            console.log('Received transactions:', response.data);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const addPaymentMethod = async () => {
        try {
            await axios.post('http://localhost:5000/payment-methods', { method: newPaymentMethod });
            setNewPaymentMethod('');
            fetchPaymentMethods();
        } catch (error) {
            console.error('Error adding payment method:', error);
        }
    };

    const updatePaymentMethod = async (id, newMethod) => {
        try {
            await axios.put(`http://localhost:5000/payment-methods/${id}`, { method: newMethod });
            setEditingPaymentMethod(null);
            fetchPaymentMethods();
        } catch (error) {
            console.error('Error updating payment method:', error);
        }
    };

    const deletePaymentMethod = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/payment-methods/${id}`);
            fetchPaymentMethods();
        } catch (error) {
            console.error('Error deleting payment method:', error);
        }
    };

    return (
        <div className="admin-page">
            <Navbar />
            <div className="admin-dashboard">
                <div className="sidebar">
                    <h2>Admin Dashboard</h2>
                    <ul>
                        <li
                            className={activeSection === 'userManagement' ? 'active' : ''}
                            onClick={() => setActiveSection('userManagement')}
                        >
                            User Management
                        </li>
                        <li
                            className={activeSection === 'reports' ? 'active' : ''}
                            onClick={() => {
                                setActiveSection('reports');
                                toggleReportSubFunctions();
                            }}
                        >
                            Reports
                        </li>
                        {showReportSubFunctions && (
                            <ul className="sub-menu">
                                <li onClick={() => generateReport('usage')}>
                                    Usage
                                </li>
                                <li onClick={() => generateReport('peak_times')}>
                                    Peak Times
                                </li>
                            </ul>
                        )}
                        <li
                            className={activeSection === 'paymentMethods' ? 'active' : ''}
                            onClick={() => setActiveSection('paymentMethods')}
                        >
                            Payment Methods
                        </li>
                        <li
                            className={activeSection === 'transactions' ? 'active' : ''}
                            onClick={() => setActiveSection('transactions')}
                        >
                            Transactions
                        </li>
                    </ul>
                </div>
                <div className="main-content">
                    {activeSection === 'userManagement' && (
                        <UserManagement
                            users={filteredUsers}
                            totalUsers={users.length}
                            loading={loading}
                            handleUpdate={handleUpdate}
                            handleDelete={handleDelete}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            usersPerPage={usersPerPage}
                            filterRole={filterRole}
                            setFilterRole={setFilterRole}
                        />
                    )}
                    {activeSection === 'reports' && (
                        <div className="section">
                            <h2>Reports</h2>

                            <div className="report-results">
                                {reportData.length > 0 ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                {reportType === 'usage' && (
                                                    <>
                                                        <th>Date</th>
                                                        <th>Number of Bookings</th>
                                                    </>
                                                )}
                                                {reportType === 'peak_times' && (
                                                    <>
                                                        <th>Time</th>
                                                        <th>Number of Bookings</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.map((item, index) => (
                                                <tr key={index}>
                                                    {reportType === 'usage' && (
                                                        <>
                                                            <td>{new Date(item.date).toLocaleDateString()}</td>
                                                            <td>{item.count}</td>
                                                        </>
                                                    )}
                                                    {reportType === 'peak_times' && (
                                                        <>
                                                            <td>{item.slot}</td>
                                                            <td>{item.count}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Choose report to show</p>
                                )}
                            </div>
                        </div>
                    )}
                    {activeSection === 'paymentMethods' && (
                        <div className="section">
                            <h2>Payment Methods</h2>
                            <div className="add-payment-method">
                                <input
                                    type="text"
                                    value={newPaymentMethod}
                                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                                    placeholder="New Payment Method"
                                />
                                <button onClick={addPaymentMethod}>Add</button>
                            </div>
                            <table className="payment-methods-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Payment Method</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentMethods.map(payment => (
                                        <tr key={payment.methodId}>
                                            <td>{payment.methodId}</td>
                                            <td>
                                                {editingPaymentMethod === payment.methodId ? (
                                                    <input
                                                        type="text"
                                                        value={payment.method}
                                                        onChange={(e) => {
                                                            const updatedMethods = paymentMethods.map(p =>
                                                                p.methodId === payment.methodId ? { ...p, method: e.target.value } : p
                                                            );
                                                            setPaymentMethods(updatedMethods);
                                                        }}
                                                    />
                                                ) : (
                                                    payment.method
                                                )}
                                            </td>
                                            <td>
                                                {editingPaymentMethod === payment.methodId ? (
                                                    <button onClick={() => updatePaymentMethod(payment.methodId, payment.method)}>Save</button>
                                                ) : (
                                                    <button onClick={() => setEditingPaymentMethod(payment.methodId)}>Update</button>
                                                )}
                                                <button onClick={() => deletePaymentMethod(payment.methodId)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {paymentMethods.length === 0 && <p>No payment methods found. Add a new payment method to get started.</p>}
                        </div>
                    )}
                    {activeSection === 'transactions' && (
                        <div className="section">
                            <h2>Transaction History</h2>
                            {transactions.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>Booking ID</th>
                                            <th>User ID</th>
                                            <th>Event Description</th>
                                            <th>Transaction Type</th>
                                            <th>Amount</th>
                                            <th>Event Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(transaction => (
                                            <tr key={transaction.transactionId}>
                                                <td>{transaction.transactionId}</td>
                                                <td>{transaction.bookingId}</td>
                                                <td>{transaction.userId}</td>
                                                <td>{transaction.eventDescription}</td>
                                                <td>{transaction.transactionType}</td>
                                                <td>${transaction.transactionAmount.toFixed(2)}</td>
                                                <td>{new Date(transaction.eventDate).toLocaleString()}</td>
                                                <td>{transaction.transactionStatus}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No transactions found. Transactions will appear here once they are processed.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {updateModalOpen && (
                <UpdateModal
                    user={currentUser}
                    onClose={() => setUpdateModalOpen(false)}
                    onSubmit={handleUpdateSubmit}
                />
            )}
        </div>
    );
};

const UserManagement = ({ users, totalUsers, loading, handleUpdate, handleDelete, currentPage, setCurrentPage, usersPerPage, filterRole, setFilterRole }) => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div className="user-management">
            <h1>User Management</h1>
            <div className="user-stats">
                <p>Total Users: {totalUsers}</p>
            </div>
            <div className="filter-controls">
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                    <option value="all">All Roles</option>
                    <option value="1">Admin</option>
                    <option value="2">Manager</option>
                    <option value="3">Staff</option>
                    <option value="4">Customer</option>
                </select>
            </div>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>{user.userEmail}</td>
                            <td>{user.userRole}</td>
                            <td>
                                <button onClick={() => handleUpdate(user)}>Update</button>
                                <button onClick={() => handleDelete(user.userId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                usersPerPage={usersPerPage}
                totalUsers={users.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
};

const UpdateModal = ({ user, onClose, onSubmit }) => {
    const [updatedUser, setUpdatedUser] = useState(user);

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(updatedUser);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Update User</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="userName"
                        value={updatedUser.userName}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    <input
                        type="email"
                        name="userEmail"
                        value={updatedUser.userEmail}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    <select
                        name="userRole"
                        value={updatedUser.userRole}
                        onChange={handleChange}
                    >
                        <option value={1}>Admin</option>
                        <option value={2}>Manager</option>
                        <option value={3}>Staff</option>
                        <option value={4}>Customer</option>
                    </select>
                    <button type="submit">Update</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className={number === currentPage ? 'active' : ''}>
                        <a onClick={() => paginate(number)} href='#!'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default AdminPage;
