// client/src/context/AuthContext.js
import React, { createContext, useState } from 'react';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [error, setError] = useState(null);

    // Mock user data
    const mockUsers = {
        'john_doe': {
            id: 'user_1',
            username: 'john_doe',
            email: 'john@example.com',
            favorites: []
        },
        'jane_smith': {
            id: 'user_2',
            username: 'jane_smith',
            email: 'jane@example.com',
            favorites: []
        },
        'alex_rock': {
            id: 'user_3',
            username: 'alex_rock',
            email: 'alex@example.com',
            favorites: []
        }
    };

    // Login user
    const login = async (userData) => {
        try {
            setError(null);

            // Check if username exists and password is correct
            if (mockUsers[userData.username] && userData.password === 'password123') {
                const loggedInUser = mockUsers[userData.username];
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                setUser(loggedInUser);
                return true;
            } else {
                setError('Invalid credentials');
                return false;
            }
        } catch (err) {
            setError('An error occurred');
            return false;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    // Other functions (simplified for demo)
    const rateSong = async () => true;
    const addToFavorites = async () => true;
    const register = async (userData) => {
        if (userData.username && userData.password) {
            const newUser = {
                id: `user_${Date.now()}`,
                username: userData.username,
                email: userData.email || `${userData.username}@example.com`,
                favorites: []
            };
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            return true;
        }
        return false;
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                error,
                register,
                login,
                logout,
                rateSong,
                addToFavorites,
                clearError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};