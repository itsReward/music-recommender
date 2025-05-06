const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const songRepository = require('../repositories/songRepository');

/**
 * @route   GET /api/songs
 * @desc    Get all songs with pagination and search
 * @access  Public
 */
router.get('/', (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;

        const result = songRepository.findAllSongs(
            parseInt(page),
            parseInt(limit),
            search
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/songs/:id
 * @desc    Get song by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
    try {
        const song = songRepository.findSongById(req.params.id);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/songs/genre/:genre
 * @desc    Get songs by genre
 * @access  Public
 */
router.get('/genre/:genre', (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const result = songRepository.findSongsByGenre(
            req.params.genre,
            parseInt(page),
            parseInt(limit)
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/songs/artist/:artist
 * @desc    Get songs by artist
 * @access  Public
 */
router.get('/artist/:artist', (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const result = songRepository.findSongsByArtist(
            req.params.artist,
            parseInt(page),
            parseInt(limit)
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/songs/top-rated
 * @desc    Get top rated songs
 * @access  Public
 */
router.get('/top-rated', (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const songs = songRepository.getTopRatedSongs(parseInt(limit));

        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   POST /api/songs
 * @desc    Add a new song (admin only in a real application)
 * @access  Public (for demo purposes, would be restricted in production)
 */
router.post('/', (req, res) => {
    try {
        const newSong = songRepository.createSong(req.body);

        res.status(201).json(newSong);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;