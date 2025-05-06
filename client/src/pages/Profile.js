import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import SongCard from '../components/SongCard';
import axios from 'axios';

const Profile = () => {
    const { user, token } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/users/profile');
                setFavorites(response.data.favorites || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load your profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    const handleRating = (songId, rating) => {
        // Update local state after rating
        setFavorites(prevSongs =>
            prevSongs.map(song =>
                song._id === songId
                    ? { ...song, userRating: rating }
                    : song
            )
        );
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h2>Hi, {user?.username}!</h2>
                <p>Here's your music profile</p>
            </div>

            <section className="favorites-section">
                <h3>Your Favorite Songs</h3>

                {favorites.length === 0 ? (
                    <p className="no-favorites">
                        You haven't added any favorites yet. Start exploring and add some songs!
                    </p>
                ) : (
                    <div className="song-grid">
                        {favorites.map(song => (
                            <SongCard
                                key={song._id}
                                song={song}
                                onRate={handleRating}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Profile;