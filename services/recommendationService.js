const userRepository = require('../repositories/userRepository');
const songRepository = require('../repositories/songRepository');
const { readMockData } = require('./mockDataService');

/**
 * Get content-based recommendations for a user
 * @param {string} userId - User ID to get recommendations for
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} - Array of recommended songs
 */
const getContentBasedRecommendations = (userId, limit = 10) => {
    console.log(`Getting content-based recommendations for user ${userId}`);

    // Get user data
    const user = userRepository.findUserById(userId);
    if (!user) {
        console.log("User not found");
        return [];
    }

    // Get all songs
    const songs = readMockData('songs.json');
    console.log(`Found ${songs.length} songs in dataset`);

    // Get user's rated songs to exclude from recommendations
    const ratedSongIds = user.ratings.map(r => r.song);
    console.log(`User has rated ${ratedSongIds.length} songs`);

    // Get top genres the user prefers
    const userGenres = Object.entries(user.genrePreferences || {})
        .sort((a, b) => b[1] - a[1])  // Sort by preference count
        .slice(0, 5)                   // Take top 5
        .map(entry => entry[0]);       // Extract genre names

    console.log(`User's top genres: ${userGenres.join(', ')}`);

    // Get top artists the user prefers
    const userArtists = Object.entries(user.artistPreferences || {})
        .sort((a, b) => b[1] - a[1])   // Sort by preference count
        .slice(0, 3)                   // Take top 3
        .map(entry => entry[0]);       // Extract artist names

    console.log(`User's top artists: ${userArtists.join(', ')}`);

    // Calculate a score for each song based on genre and artist matches
    const scoredSongs = songs
        .filter(song => !ratedSongIds.includes(song._id)) // Exclude already rated songs
        .map(song => {
            let score = 0;

            // Score based on genre matches
            for (const genre of song.genres) {
                if (userGenres.includes(genre)) {
                    score += 2; // More weight to genre matches
                }
            }

            // Score based on artist matches
            if (userArtists.includes(song.artist)) {
                score += 3; // More weight to artist matches
            }

            // Add some weight for song rating
            score += (song.averageRating || 0) * 0.5;

            return { song, score };
        })
        .filter(item => item.score > 0) // Only include songs with positive scores
        .sort((a, b) => b.score - a.score); // Sort by score descending

    console.log(`Found ${scoredSongs.length} potential recommendations`);

    // Take the top N recommendations
    const recommendations = scoredSongs
        .slice(0, limit)
        .map(item => item.song);

    console.log(`Returning ${recommendations.length} content-based recommendations`);
    return recommendations;
};

/**
 * Calculate similarity score between two users based on their ratings
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {number} - Similarity score between 0 and 1
 */
const calculateUserSimilarity = (user1, user2) => {
    // Create maps of song ratings for faster lookup
    const user1Ratings = new Map(
        user1.ratings.map(r => [r.song, r.rating])
    );

    const user2Ratings = new Map(
        user2.ratings.map(r => [r.song, r.rating])
    );

    // Find common rated songs
    let similarityScore = 0;
    let commonRatings = 0;

    // Check all songs rated by user1
    for (const [songId, rating1] of user1Ratings.entries()) {
        if (user2Ratings.has(songId)) {
            const rating2 = user2Ratings.get(songId);

            // Calculate rating similarity (inverse of difference)
            // 5 - |rating1 - rating2| normalized to 0-1 range
            const ratingDifference = Math.abs(rating1 - rating2);
            similarityScore += (5 - ratingDifference) / 5;
            commonRatings++;
        }
    }

    // No common ratings means no similarity
    if (commonRatings === 0) {
        return 0;
    }

    // Normalize by number of common ratings
    return similarityScore / commonRatings;
};

/**
 * Get collaborative filtering recommendations for a user
 * @param {string} userId - User ID to get recommendations for
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} - Array of recommended songs
 */
const getCollaborativeRecommendations = (userId, limit = 10) => {
    console.log(`Getting collaborative recommendations for user ${userId}`);

    // Get all users and songs
    const users = readMockData('users.json');
    const songs = readMockData('songs.json');

    console.log(`Found ${users.length} users and ${songs.length} songs in dataset`);

    // Get current user
    const currentUser = users.find(u => u._id === userId);
    if (!currentUser || !currentUser.ratings || currentUser.ratings.length === 0) {
        console.log("User has no ratings, can't make collaborative recommendations");
        return []; // No recommendations possible without ratings
    }

    console.log(`User has ${currentUser.ratings.length} ratings`);

    // Get songs already rated by current user
    const ratedSongIds = currentUser.ratings.map(r => r.song);

    // Calculate similarity with all other users
    const userSimilarities = users
        .filter(u => u._id !== userId) // Exclude current user
        .map(otherUser => {
            // Skip users with no ratings
            if (!otherUser.ratings || otherUser.ratings.length === 0) {
                return { userId: otherUser._id, similarity: 0 };
            }

            const similarity = calculateUserSimilarity(currentUser, otherUser);
            return { userId: otherUser._id, similarity, username: otherUser.username };
        })
        .filter(item => item.similarity > 0.1) // Only include users with decent similarity
        .sort((a, b) => b.similarity - a.similarity); // Sort by similarity descending

    console.log(`Found ${userSimilarities.length} similar users`);
    if (userSimilarities.length > 0) {
        console.log(`Most similar user: ${userSimilarities[0].username} with similarity ${userSimilarities[0].similarity.toFixed(2)}`);
    }

    // Take top 10 similar users (or fewer if not enough)
    const topSimilarUsers = userSimilarities.slice(0, 10);

    // Get song recommendations from similar users
    const recommendedSongs = [];

    // For each similar user
    for (const { userId, similarity } of topSimilarUsers) {
        const similarUser = users.find(u => u._id === userId);

        // For each song rated by the similar user
        for (const { song: songId, rating } of similarUser.ratings) {
            // Skip songs already rated by current user
            if (ratedSongIds.includes(songId)) {
                continue;
            }

            // Only consider songs rated 4 or 5 by similar user
            if (rating >= 4) {
                // Weight the recommendation by user similarity
                const weightedScore = rating * similarity;

                // Check if song is already in recommendations
                const existingIndex = recommendedSongs.findIndex(r => r.songId === songId);

                if (existingIndex !== -1) {
                    // Update score if song already recommended
                    recommendedSongs[existingIndex].score += weightedScore;
                    recommendedSongs[existingIndex].count += 1;
                } else {
                    // Add new recommendation
                    recommendedSongs.push({
                        songId,
                        score: weightedScore,
                        count: 1
                    });
                }
            }
        }
    }

    console.log(`Generated ${recommendedSongs.length} potential collaborative recommendations`);

    // If we couldn't find enough recommendations through collaborative filtering,
    // fall back to some highly-rated songs the user hasn't rated
    if (recommendedSongs.length < limit) {
        console.log("Not enough collaborative recommendations, adding fallback recommendations");

        // Get top-rated songs not yet rated by user
        const topRatedSongs = songs
            .filter(song => !ratedSongIds.includes(song._id))
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            .slice(0, limit - recommendedSongs.length);

        // Add to recommendations
        topRatedSongs.forEach(song => {
            recommendedSongs.push({
                songId: song._id,
                score: (song.averageRating || 3) * 0.5, // Lower score for fallback recommendations
                count: 1
            });
        });
    }

    // Normalize scores by dividing by count
    recommendedSongs.forEach(rec => {
        rec.score = rec.score / rec.count;
    });

    // Sort by score and take top recommendations
    const topRecommendations = recommendedSongs
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    // Get full song data for recommendations
    const recommendedSongData = topRecommendations
        .map(rec => {
            const song = songs.find(song => song._id === rec.songId);
            return song;
        })
        .filter(Boolean); // Remove any null values

    console.log(`Returning ${recommendedSongData.length} collaborative recommendations`);
    return recommendedSongData;
};

/**
 * Get hybrid recommendations combining both methods
 * @param {string} userId - User ID to get recommendations for
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} - Array of recommended songs
 */
const getHybridRecommendations = (userId, limit = 15) => {
    console.log(`Getting hybrid recommendations for user ${userId}`);

    // Get recommendations from both methods
    const contentBased = getContentBasedRecommendations(userId, Math.floor(limit * 0.6));
    const collaborative = getCollaborativeRecommendations(userId, Math.floor(limit * 0.8));

    console.log(`Retrieved ${contentBased.length} content-based and ${collaborative.length} collaborative recommendations`);

    // Create a map for quick lookups and to remove duplicates
    const recommendationsMap = new Map();

    // Add content-based recommendations with 40% weight
    contentBased.forEach((song, index) => {
        const position = contentBased.length - index; // Reverse position for scoring
        recommendationsMap.set(song._id, {
            song,
            score: position * 0.4
        });
    });

    // Add collaborative recommendations with 60% weight
    collaborative.forEach((song, index) => {
        const position = collaborative.length - index; // Reverse position for scoring

        if (recommendationsMap.has(song._id)) {
            // Update score if already recommended
            const existing = recommendationsMap.get(song._id);
            existing.score += position * 0.6;
        } else {
            // Add new recommendation
            recommendationsMap.set(song._id, {
                song,
                score: position * 0.6
            });
        }
    });

    // Convert to array, sort by score, and extract songs
    const hybridRecommendations = Array.from(recommendationsMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.song);

    console.log(`Returning ${hybridRecommendations.length} hybrid recommendations`);
    return hybridRecommendations;
};

module.exports = {
    getContentBasedRecommendations,
    getCollaborativeRecommendations,
    getHybridRecommendations
};