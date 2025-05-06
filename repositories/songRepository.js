const { readMockData, writeMockData } = require('../services/mockDataService');

// Find all songs with pagination and search
const findAllSongs = (page = 1, limit = 20, search = '') => {
    const songs = readMockData('songs.json');

    let filteredSongs = songs;

    // Apply search if provided
    if (search) {
        const searchLower = search.toLowerCase();
        filteredSongs = songs.filter(song =>
            song.title.toLowerCase().includes(searchLower) ||
            song.artist.toLowerCase().includes(searchLower) ||
            song.album.toLowerCase().includes(searchLower) ||
            song.genres.some(genre => genre.toLowerCase().includes(searchLower))
        );
    }

    // Get total count
    const total = filteredSongs.length;

    // Apply pagination
    const start = (page - 1) * limit;
    const paginatedSongs = filteredSongs.slice(start, start + limit);

    return {
        songs: paginatedSongs,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page)
    };
};

// Find a song by ID
const findSongById = (id) => {
    const songs = readMockData('songs.json');
    return songs.find(song => song._id === id);
};

// Find songs by genre
const findSongsByGenre = (genre, page = 1, limit = 20) => {
    const songs = readMockData('songs.json');

    const filteredSongs = songs.filter(song =>
        song.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );

    // Get total count
    const total = filteredSongs.length;

    // Apply pagination
    const start = (page - 1) * limit;
    const paginatedSongs = filteredSongs.slice(start, start + limit);

    return {
        songs: paginatedSongs,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page)
    };
};

// Find songs by artist
const findSongsByArtist = (artist, page = 1, limit = 20) => {
    const songs = readMockData('songs.json');

    const filteredSongs = songs.filter(song =>
        song.artist.toLowerCase().includes(artist.toLowerCase())
    );

    // Get total count
    const total = filteredSongs.length;

    // Apply pagination
    const start = (page - 1) * limit;
    const paginatedSongs = filteredSongs.slice(start, start + limit);

    return {
        songs: paginatedSongs,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page)
    };
};

// Create a new song
const createSong = (songData) => {
    const songs = readMockData('songs.json');

    // Create new song with unique ID
    const newSong = {
        _id: `song_${Date.now()}`,
        ...songData,
        averageRating: 0,
        ratingCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    songs.push(newSong);
    writeMockData('songs.json', songs);

    return newSong;
};

// Update a song
const updateSong = (id, updates) => {
    const songs = readMockData('songs.json');
    const songIndex = songs.findIndex(song => song._id === id);

    if (songIndex === -1) {
        return null;
    }

    // Update song data
    songs[songIndex] = {
        ...songs[songIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    writeMockData('songs.json', songs);
    return songs[songIndex];
};

// Get top rated songs
const getTopRatedSongs = (limit = 10) => {
    const songs = readMockData('songs.json');

    // Sort by average rating (descending)
    const sortedSongs = [...songs].sort((a, b) =>
        (b.averageRating || 0) - (a.averageRating || 0)
    );

    return sortedSongs.slice(0, limit);
};

module.exports = {
    findAllSongs,
    findSongById,
    findSongsByGenre,
    findSongsByArtist,
    createSong,
    updateSong,
    getTopRatedSongs
};