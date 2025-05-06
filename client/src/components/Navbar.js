import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <i className="fas fa-headphones"></i> MusicMatcher
                </Link>
            </div>
            <div className="navbar-menu">
                <Link to="/" className="navbar-item">Home</Link>
                {user ? (
                    <>
                        <Link to="/recommendations" className="navbar-item">Recommendations</Link>
                        <Link to="/profile" className="navbar-item">Profile</Link>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-item">Login</Link>
                        <Link to="/register" className="navbar-item">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;