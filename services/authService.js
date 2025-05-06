// services/authService.js
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

/**
 * Login a user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Object} - User object without password
 */
const login = async (username, password) => {
    try {
        // Find user
        const user = userRepository.findUserByUsername(username);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Return user info (no token)
        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} - User object without password
 */
const register = async (userData) => {
    try {
        // Check if user already exists
        const existingUserByEmail = userRepository.findUserByEmail(userData.email);
        if (existingUserByEmail) {
            throw new Error('User with this email already exists');
        }

        const existingUserByUsername = userRepository.findUserByUsername(userData.username);
        if (existingUserByUsername) {
            throw new Error('User with this username already exists');
        }

        // Create new user
        const newUser = await userRepository.createUser(userData);

        // Return user info (no token)
        return {
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    login,
    register
};