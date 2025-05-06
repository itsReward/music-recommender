import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/api/songs?page=${page}&limit=10&search=${search}`
                );

                setSongs(response.data.songs);
                setTotalPages(response.data.totalPages);
                setError(null);
            } catch (err) {
                console.error('Error fetching songs:', err);
                setError('Failed to load songs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [page, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
    };

    const handleRating = (songId, rating) => {
        // Update local state after rating
        setSongs(prevSongs =>
            prevSongs.map(song =>
                song._id === songId
                    ? { ...song, userRating: rating }
                    : song
            )
        );
    };

    return (
        <div className="home-page">
            <section className="hero">
                <h1>Discover Your Perfect Sound</h1>
                <p>Get personalized music recommendations based on your taste</p>

                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search songs, artists, or albums..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </section>

            <section className="songs-container">
                <h2>Popular Tracks</h2>

                {loading ? (
                    <div className="loading">Loading songs...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : songs.length === 0 ? (
                    <div className="no-results">No songs found</div>
                ) : (
                    <div className="song-grid">
                        {songs.map(song => (
                            <SongCard
                                key={song._id}
                                song={song}
                                onRate={handleRating}
                            />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;