const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recommendationService = require('../services/recommendationService');

/**
 * @route   GET /api/recommendations/content-based
 * @desc    Get content-based recommendations
 * @access  Private
 */
router.get('/content-based', auth, (req, res) => {
    try {
        console.log('Content-based recommendation request received for user', req.user.id);
        const { limit = 10 } = req.query;

        const recommendations = recommendationService.getContentBasedRecommendations(
            req.user.id,
            parseInt(limit)
        );

        console.log(`Sending ${recommendations.length} content-based recommendations to client`);

        res.status(200).json({
            recommendations,
            type: 'content-based'
        });
    } catch (error) {
        console.error('Error in content-based recommendations:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/recommendations/collaborative
 * @desc    Get collaborative filtering recommendations
 * @access  Private
 */
router.get('/collaborative', auth, (req, res) => {
    try {
        console.log('Collaborative recommendation request received for user', req.user.id);
        const { limit = 10 } = req.query;

        const recommendations = recommendationService.getCollaborativeRecommendations(
            req.user.id,
            parseInt(limit)
        );

        console.log(`Sending ${recommendations.length} collaborative recommendations to client`);

        res.status(200).json({
            recommendations,
            type: 'collaborative'
        });
    } catch (error) {
        console.error('Error in collaborative recommendations:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/recommendations/hybrid
 * @desc    Get hybrid recommendations (combining both approaches)
 * @access  Private
 */
router.get('/hybrid', auth, (req, res) => {
    try {
        console.log('Hybrid recommendation request received for user', req.user.id);
        const { limit = 15 } = req.query;

        const recommendations = recommendationService.getHybridRecommendations(
            req.user.id,
            parseInt(limit)
        );

        console.log(`Sending ${recommendations.length} hybrid recommendations to client`);

        res.status(200).json({
            recommendations,
            type: 'hybrid'
        });
    } catch (error) {
        console.error('Error in hybrid recommendations:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;