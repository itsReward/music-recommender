const { readMockData, writeMockData } = require('../services/mockDataService');
const bcrypt = require('bcryptjs');

// Find a user by ID
const findUserById = (id) => {
    const users = readMockData('users.json');
    return users.find(user => user._id === id);
};

// Find a user by username
const findUserByUsername = (username) => {
    const users = readMockData('users.json');
    return users.find(user => user.username === username);
};

// Find a user by email
const findUserByEmail = (email) => {
    const users = readMockData('users.json');
    return users.find(user => user.email === email);
};

// Create a new user
const createUser = async (userData) => {
    const users = readMockData('users.json');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user with unique ID
    const newUser = {
        _id: `user_${Date.now()}`,
        ...userData,
        password: hashedPassword,
        favorites: [],
        ratings: [],
        genrePreferences: {},
        artistPreferences: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    writeMockData('users.json', users);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

// Update a user
const updateUser = (id, updates) => {
    const users = readMockData('users.json');
    const userIndex = users.findIndex(user => user._id === id);

    if (userIndex === -1) {
        return null;
    }

    // Update user data
    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    writeMockData('users.json', users);

    // Return updated user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
};

// Add a song to user's favorites
const addToFavorites = (userId, songId) => {
    const users = readMockData('users.json');
    const userIndex = users.findIndex(user => user._id === userId);

    if (userIndex === -1) {
        return null;
    }

    // Only add if not already in favorites
    if (!users[userIndex].favorites.includes(songId)) {
        users[userIndex].favorites.push(songId);
        users[userIndex].updatedAt = new Date().toISOString();
        writeMockData('users.json', users);
    }

    return users[userIndex].favorites;
};

// Remove a song from user's favorites
const removeFromFavorites = (userId, songId) => {
    const users = readMockData('users.json');
    const userIndex = users.findIndex(user => user._id === userId);

    if (userIndex === -1) {
        return null;
    }

    users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== songId);
    users[userIndex].updatedAt = new Date().toISOString();
    writeMockData('users.json', users);

    return users[userIndex].favorites;
};

// Rate a song
const rateSong = (userId, songId, rating) => {
    const users = readMockData('users.json');
    const userIndex = users.findIndex(user => user._id === userId);

    if (userIndex === -1) {
        return null;
    }

    // Find if song is already rated
    const ratingIndex = users[userIndex].ratings.findIndex(
        r => r.song === songId
    );

    // Update or add rating
    if (ratingIndex > -1) {
        users[userIndex].ratings[ratingIndex].rating = rating;
    } else {
        users[userIndex].ratings.push({ song: songId, rating });
    }

    // Update user's genre and artist preferences
    const songs = readMockData('songs.json');
    const song = songs.find(s => s._id === songId);

    if (song) {
        // Update genre preferences
        song.genres.forEach(genre => {
            users[userIndex].genrePreferences[genre] =
                (users[userIndex].genrePreferences[genre] || 0) + 1;
        });

        // Update artist preferences
        users[userIndex].artistPreferences[song.artist] =
            (users[userIndex].artistPreferences[song.artist] || 0) + 1;
    }

    users[userIndex].updatedAt = new Date().toISOString();
    writeMockData('users.json', users);

    // Also update song's average rating
    updateSongRating(songId, rating);

    return users[userIndex].ratings;
};

// Update a song's average rating
const updateSongRating = (songId, newRating) => {
    const songs = readMockData('songs.json');
    const songIndex = songs.findIndex(s => s._id === songId);

    if (songIndex === -1) {
        return null;
    }

    const song = songs[songIndex];

    // Update song's rating
    song.ratingCount = (song.ratingCount || 0) + 1;
    song.averageRating = ((song.averageRating || 0) * (song.ratingCount - 1) + newRating) / song.ratingCount;

    writeMockData('songs.json', songs);
    return song;
};

// Get user profile with populated favorites
const getUserProfile = (userId) => {
    const user = findUserById(userId);

    if (!user) {
        return null;
    }

    // Get songs for favorites
    const songs = readMockData('songs.json');
    const favoriteSongs = songs.filter(song =>
        user.favorites.includes(song._id)
    );

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return {
        ...userWithoutPassword,
        favorites: favoriteSongs
    };
};

module.exports = {
    findUserById,
    findUserByUsername,
    findUserByEmail,
    createUser,
    updateUser,
    addToFavorites,
    removeFromFavorites,
    rateSong,
    getUserProfile
};