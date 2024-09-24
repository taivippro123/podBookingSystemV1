import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import AboutUs from './AboutUs';
import Contact from './Contact';
import CustomerPage from './CustomerPage';
import StaffPage from './StaffPage';
import AdminPage from './AdminPage';
import ManagerPage from './ManagerPage';
import Booking from './Booking';
import Profile from './Profile'; // Import the new Profile component
import ViewBookings from './ViewBookings'; // Import the new ViewBookings component
import Payment from './Payment';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={
          <ProtectedRoute allowedRoles={[4]}>
            <Booking />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute allowedRoles={[4]}>
            <Payment />

          </ProtectedRoute>
        } />

        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={[4]}>
            <CustomerPage />
          </ProtectedRoute>

        } />
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={[3]}>
            <StaffPage />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminPage />
          </ProtectedRoute>
        } />

        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={[2]}>
            <ManagerPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
            <ViewBookings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
