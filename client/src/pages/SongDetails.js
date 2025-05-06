import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SongDetails = () => {
    const { id } = useParams();
    const { user, rateSong, addToFavorites } = useContext(AuthContext);
    const [song, setSong] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSongDetails = async () => {
            try {
                setLoading(true);

                // Fetch song details
                const songResponse = await axios.get(`/api/songs/${id}`);
                setSong(songResponse.data);

                // If user is logged in, check if they have already rated this song
                if (user) {
                    const userResponse = await axios.get('/api/users/profile');
                    const userRatingObj = userResponse.data.ratings.find(
                        r => r.song === id
                    );

                    if (userRatingObj) {
                        setUserRating(userRatingObj.rating);
                    }
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching song details:', err);
                setError('Failed to load song details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSongDetails();
    }, [id, user]);

    const handleRate = async (rating) => {
        if (!user) return;

        try {
            const success = await rateSong(id, rating);

            if (success) {
                setUserRating(rating);
            }
        } catch (err) {
            console.error('Error rating song:', err);
        }
    };

    const handleAddToFavorites = async () => {
        if (!user) return;

        try {
            await addToFavorites(id);
        } catch (err) {
            console.error('Error adding to favorites:', err);
        }
    };

    if (loading) {
        return <div className="loading">Loading song details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!song) {
        return <div className="not-found">Song not found</div>;
    }

    return (
        <div className="song-details-page">
            <div className="song-details-container">
                <h2>{song.title}</h2>
                <div className="song-metadata">
                    <p className="artist"><strong>Artist:</strong> {song.artist}</p>
                    <p className="album"><strong>Album:</strong> {song.album} ({song.year})</p>
                    <div className="genres">
                        <strong>Genres:</strong>
                        {song.genres.map(genre => (
                            <span key={genre} className="genre-tag">{genre}</span>
                        ))}
                    </div>
                    <p className="duration">
                        <strong>Duration:</strong> {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                    </p>
                </div>

                {song.features && (
                    <div className="song-features">
                        <h3>Audio Features</h3>
                        <div className="features-grid">
                            {Object.entries(song.features).map(([feature, value]) => (
                                <div key={feature} className="feature-item">
                                    <span className="feature-name">{feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
                                    <div className="feature-bar">
                                        <div
                                            className="feature-fill"
                                            style={{ width: `${(value * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="feature-value">{Math.round(value * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {user ? (
                    <div className="song-actions">
                        <div className="rating-container">
                            <h3>Rate This Song</h3>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <i
                                        key={star}
                                        className={`fas fa-star ${userRating >= star ? 'active' : ''}`}
                                        onClick={() => handleRate(star)}
                                    ></i>
                                ))}
                            </div>
                        </div>

                        <button className="favorite-btn" onClick={handleAddToFavorites}>
                            <i className="fas fa-heart"></i> Add to Favorites
                        </button>
                    </div>
                ) : (
                    <div className="login-prompt-container">
                        <p className="login-prompt">
                            <Link to="/login">Log in</Link> to rate and save this song
                        </p>
                    </div>
                )}

                <div className="community-rating">
                    <h3>Community Rating</h3>
                    <div className="average-rating">
                        <span className="rating-value">{song.averageRating?.toFixed(1) || 'N/A'}</span>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <i
                                    key={star}
                                    className={`fas fa-star ${song.averageRating >= star ? 'filled' :
                                        song.averageRating >= star - 0.5 ? 'half-filled' : ''}`}
                                ></i>
                            ))}
                        </div>
                        <span className="rating-count">({song.ratingCount || 0} ratings)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongDetails;