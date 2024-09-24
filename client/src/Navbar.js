import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('user'));
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const handleLogout = () => {
		localStorage.removeItem('user');
		navigate('/'); // Changed to navigate to home page
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<nav className="navbar">
			<div className="navbar-container wide-container">
				<div className="navbar-left">
					<img src="/img/logoMomo.png" alt="Pod Booking System Logo" className="navbar-logo" />
					<ul className="navbar-nav">
						<li className="nav-item">
							<Link to="/" className="nav-link">Home</Link>
						</li>
						<li className="nav-item">
							<Link to="/about" className="nav-link">About Us</Link>
						</li>
						<li className="nav-item">
							<Link to="/contact" className="nav-link">Contact</Link>
						</li>
					</ul>
				</div>
				<div className="navbar-auth">
					{user ? (
						<div className="user-dropdown" ref={dropdownRef}>
							<button onClick={toggleDropdown} className="dropdown-toggle">
								{user.userName}
							</button>
							{dropdownOpen && (
								<ul className="dropdown-menu">
									<li><Link to="/profile" className="dropdown-item">View Profile</Link></li>
									<li><Link to="/bookings" className="dropdown-item">View Booking</Link></li>
									<li><button onClick={handleLogout} className="dropdown-item">Logout</button></li>
								</ul>
							)}
						</div>
					) : (
						<Link to="/login" className="login-btn">Login</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;