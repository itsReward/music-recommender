const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authService = require('../services/authService');
const userRepository = require('../repositories/userRepository');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Register user
        const result = await authService.register({ username, email, password });

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
// routes/userRoutes.js (login route)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Login user
        const result = await authService.login(username, password);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth, (req, res) => {
    try {
        const profile = userRepository.getUserProfile(req.user.id);

        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   POST /api/users/favorites
 * @desc    Add a song to favorites
 * @access  Private
 */
router.post('/favorites', auth, (req, res) => {
    try {
        const { songId } = req.body;

        if (!songId) {
            return res.status(400).json({ message: 'Song ID is required' });
        }

        const favorites = userRepository.addToFavorites(req.user.id, songId);

        if (!favorites) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Added to favorites', favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   DELETE /api/users/favorites/:songId
 * @desc    Remove a song from favorites
 * @access  Private
 */
router.delete('/favorites/:songId', auth, (req, res) => {
    try {
        const songId = req.params.songId;

        const favorites = userRepository.removeFromFavorites(req.user.id, songId);

        if (!favorites) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Removed from favorites', favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   POST /api/users/rate
 * @desc    Rate a song
 * @access  Private
 */
router.post('/rate', auth, (req, res) => {
    try {
        const { songId, rating } = req.body;

        // Validate input
        if (!songId || !rating) {
            return res.status(400).json({ message: 'Song ID and rating are required' });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const updatedRatings = userRepository.rateSong(req.user.id, songId, rating);

        if (!updatedRatings) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Rating submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;