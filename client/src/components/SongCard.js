import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SongCard = ({ song, onRate }) => {
    const { user, rateSong, addToFavorites } = useContext(AuthContext);

    // Function to handle rating a song
    const handleRate = async (rating) => {
        if (!user) return;

        const success = await rateSong(song._id, rating);

        if (success && onRate) {
            onRate(song._id, rating);
        }
    };

    // Function to handle adding a song to favorites
    const handleAddToFavorites = async () => {
        if (!user) return;

        await addToFavorites(song._id);
    };

    return (
        <div className="song-card">
            <div className="song-info">
                <h3><Link to={`/song/${song._id}`}>{song.title}</Link></h3>
                <p className="artist">{song.artist}</p>
                <p className="album">{song.album} ({song.year})</p>
                <div className="genres">
                    {song.genres.map(genre => (
                        <span key={genre} className="genre-tag">{genre}</span>
                    ))}
                </div>
            </div>
            <div className="song-actions">
                {user && (
                    <>
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <i
                                    key={star}
                                    className={`fas fa-star ${song.userRating >= star ? 'active' : ''}`}
                                    onClick={() => handleRate(star)}
                                    title={`Rate ${star} stars`}
                                ></i>
                            ))}
                        </div>
                        <button
                            className="favorite-btn"
                            onClick={handleAddToFavorites}
                            title="Add to favorites"
                        >
                            <i className="fas fa-heart"></i>
                        </button>
                    </>
                )}
                {!user && (
                    <p className="login-prompt">
                        <Link to="/login">Log in</Link> to rate and save
                    </p>
                )}
            </div>
        </div>
    );
};

export default SongCard;