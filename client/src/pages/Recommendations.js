import React, { useState, useEffect, useContext } from 'react';
import SongCard from '../components/SongCard';
import { AuthContext } from '../context/AuthContext';

const Recommendations = () => {
    const { user } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState({
        content: [],
        collaborative: [],
        hybrid: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hybrid');

    // Synthetic song data
    const mockSongs = {
        // Pop Songs
        pop1: {
            _id: 'rec_pop1',
            title: 'Watermelon Sugar',
            artist: 'Harry Styles',
            album: 'Fine Line',
            year: 2019,
            genres: ['Pop', 'R&B'],
            duration: 174,
            averageRating: 4.3,
            ratingCount: 156
        },
        pop2: {
            _id: 'rec_pop2',
            title: 'Don\'t Start Now',
            artist: 'Dua Lipa',
            album: 'Future Nostalgia',
            year: 2020,
            genres: ['Pop', 'Disco'],
            duration: 183,
            averageRating: 4.4,
            ratingCount: 142
        },
        pop3: {
            _id: 'rec_pop3',
            title: 'Levitating',
            artist: 'Dua Lipa ft. DaBaby',
            album: 'Future Nostalgia',
            year: 2020,
            genres: ['Pop', 'Disco'],
            duration: 203,
            averageRating: 4.5,
            ratingCount: 178
        },

        // Rock Songs
        rock1: {
            _id: 'rec_rock1',
            title: 'Do I Wanna Know?',
            artist: 'Arctic Monkeys',
            album: 'AM',
            year: 2013,
            genres: ['Rock', 'Indie Rock'],
            duration: 272,
            averageRating: 4.7,
            ratingCount: 203
        },
        rock2: {
            _id: 'rec_rock2',
            title: 'Everlong',
            artist: 'Foo Fighters',
            album: 'The Colour and the Shape',
            year: 1997,
            genres: ['Rock', 'Alternative Rock'],
            duration: 250,
            averageRating: 4.8,
            ratingCount: 189
        },
        rock3: {
            _id: 'rec_rock3',
            title: 'Back In Black',
            artist: 'AC/DC',
            album: 'Back In Black',
            year: 1980,
            genres: ['Hard Rock', 'Rock'],
            duration: 255,
            averageRating: 4.9,
            ratingCount: 231
        },

        // Electronic/Dance Songs
        dance1: {
            _id: 'rec_dance1',
            title: 'Strobe',
            artist: 'deadmau5',
            album: 'For Lack of a Better Name',
            year: 2009,
            genres: ['Electronic', 'Progressive House'],
            duration: 608,
            averageRating: 4.6,
            ratingCount: 167
        },
        dance2: {
            _id: 'rec_dance2',
            title: 'Opus',
            artist: 'Eric Prydz',
            album: 'Opus',
            year: 2016,
            genres: ['Progressive House', 'Electronic'],
            duration: 562,
            averageRating: 4.5,
            ratingCount: 144
        },
        dance3: {
            _id: 'rec_dance3',
            title: 'Levels',
            artist: 'Avicii',
            album: 'True',
            year: 2011,
            genres: ['Electronic', 'EDM'],
            duration: 210,
            averageRating: 4.7,
            ratingCount: 212
        },

        // Soul/R&B Songs
        soul1: {
            _id: 'rec_soul1',
            title: 'Redbone',
            artist: 'Childish Gambino',
            album: 'Awaken, My Love!',
            year: 2016,
            genres: ['Soul', 'R&B', 'Funk'],
            duration: 326,
            averageRating: 4.6,
            ratingCount: 198
        },
        soul2: {
            _id: 'rec_soul2',
            title: 'Cranes in the Sky',
            artist: 'Solange',
            album: 'A Seat at the Table',
            year: 2016,
            genres: ['R&B', 'Soul'],
            duration: 251,
            averageRating: 4.4,
            ratingCount: 156
        },

        // Alternative/Indie Songs
        indie1: {
            _id: 'rec_indie1',
            title: 'Take Me Out',
            artist: 'Franz Ferdinand',
            album: 'Franz Ferdinand',
            year: 2004,
            genres: ['Indie Rock', 'Alternative'],
            duration: 237,
            averageRating: 4.5,
            ratingCount: 167
        },
        indie2: {
            _id: 'rec_indie2',
            title: 'Mr. Brightside',
            artist: 'The Killers',
            album: 'Hot Fuss',
            year: 2004,
            genres: ['Indie Rock', 'Alternative'],
            duration: 222,
            averageRating: 4.8,
            ratingCount: 223
        }
    };

    useEffect(() => {
        // Simulate loading
        setLoading(true);

        setTimeout(() => {
            // Generate recommendations based on user
            let contentRecs = [];
            let collaborativeRecs = [];
            let hybridRecs = [];

            if (user) {
                switch(user.username) {
                    // John Doe - Pop/R&B fan
                    case 'john_doe':
                        contentRecs = [
                            mockSongs.pop1,
                            mockSongs.pop2,
                            mockSongs.pop3,
                            mockSongs.soul1,
                            mockSongs.soul2
                        ];
                        collaborativeRecs = [
                            mockSongs.pop3,
                            mockSongs.indie2,
                            mockSongs.pop1,
                            mockSongs.soul1,
                            mockSongs.rock1
                        ];
                        hybridRecs = [
                            mockSongs.pop3,
                            mockSongs.soul1,
                            mockSongs.pop1,
                            mockSongs.indie2,
                            mockSongs.pop2,
                            mockSongs.soul2
                        ];
                        break;

                    // Jane Smith - Dance/Electropop fan
                    case 'jane_smith':
                        contentRecs = [
                            mockSongs.dance1,
                            mockSongs.dance2,
                            mockSongs.dance3,
                            mockSongs.pop2,
                            mockSongs.pop3
                        ];
                        collaborativeRecs = [
                            mockSongs.dance3,
                            mockSongs.pop2,
                            mockSongs.indie1,
                            mockSongs.dance1,
                            mockSongs.indie2
                        ];
                        hybridRecs = [
                            mockSongs.dance3,
                            mockSongs.dance1,
                            mockSongs.pop2,
                            mockSongs.dance2,
                            mockSongs.indie2,
                            mockSongs.pop3
                        ];
                        break;

                    // Alex Rock - Rock music fan
                    case 'alex_rock':
                        contentRecs = [
                            mockSongs.rock1,
                            mockSongs.rock2,
                            mockSongs.rock3,
                            mockSongs.indie1,
                            mockSongs.indie2
                        ];
                        collaborativeRecs = [
                            mockSongs.rock2,
                            mockSongs.indie2,
                            mockSongs.indie1,
                            mockSongs.rock3,
                            mockSongs.rock1
                        ];
                        hybridRecs = [
                            mockSongs.rock2,
                            mockSongs.indie2,
                            mockSongs.rock3,
                            mockSongs.rock1,
                            mockSongs.indie1,
                            mockSongs.pop1
                        ];
                        break;

                    default:
                        // Generic recommendations for new users
                        contentRecs = [
                            mockSongs.pop1,
                            mockSongs.rock1,
                            mockSongs.dance1,
                            mockSongs.soul1,
                            mockSongs.indie1
                        ];
                        collaborativeRecs = [
                            mockSongs.pop3,
                            mockSongs.indie2,
                            mockSongs.rock2,
                            mockSongs.dance3,
                            mockSongs.soul2
                        ];
                        hybridRecs = [
                            mockSongs.pop2,
                            mockSongs.rock3,
                            mockSongs.dance2,
                            mockSongs.indie2,
                            mockSongs.soul1,
                            mockSongs.pop1
                        ];
                }
            } else {
                // Default recommendations if no user (shouldn't happen due to Protected Route)
                contentRecs = [mockSongs.pop1, mockSongs.rock1, mockSongs.dance1];
                collaborativeRecs = [mockSongs.indie1, mockSongs.soul1, mockSongs.pop2];
                hybridRecs = [mockSongs.pop1, mockSongs.indie2, mockSongs.rock2];
            }

            setRecommendations({
                content: contentRecs,
                collaborative: collaborativeRecs,
                hybrid: hybridRecs
            });

            setLoading(false);
        }, 1000); // Simulate network delay
    }, [user]);

    const handleRating = (songId, rating) => {
        // Update recommendations after rating (just for UI feedback)
        setRecommendations(prev => ({
            content: prev.content.map(song =>
                song._id === songId ? { ...song, userRating: rating } : song
            ),
            collaborative: prev.collaborative.map(song =>
                song._id === songId ? { ...song, userRating: rating } : song
            ),
            hybrid: prev.hybrid.map(song =>
                song._id === songId ? { ...song, userRating: rating } : song
            )
        }));
    };

    const renderTabContent = () => {
        const currentRecommendations = recommendations[activeTab];

        if (loading) {
            return <div className="loading">Loading recommendations...</div>;
        }

        if (currentRecommendations.length === 0) {
            return (
                <div className="no-recommendations">
                    <p>No recommendations available yet. Try rating more songs to get better recommendations!</p>
                </div>
            );
        }

        return (
            <div className="song-grid">
                {currentRecommendations.map(song => (
                    <SongCard
                        key={song._id}
                        song={song}
                        onRate={handleRating}
                    />
                ))}
            </div>
        );
    };

    const getExplanation = () => {
        if (user) {
            switch(user.username) {
                case 'john_doe':
                    return "Based on your preference for Pop and R&B music, and your high ratings for artists like Ed Sheeran and Michael Jackson.";
                case 'jane_smith':
                    return "Based on your interest in Dance, Electropop, and your ratings for artists like The Weeknd and Billie Eilish.";
                case 'alex_rock':
                    return "Based on your love for Rock music and your high ratings for artists like Eagles, Nirvana, and Led Zeppelin.";
                default:
                    return "Based on your listening history and ratings.";
            }
        }
        return "";
    };

    return (
        <div className="recommendations-page">
            <div className="recommendations-header">
                <h2>Your Personalized Recommendations</h2>
                <p>Discover new music based on your taste and preferences</p>
                <p className="personal-explanation">{getExplanation()}</p>
            </div>

            <div className="recommendation-tabs">
                <button
                    className={`tab ${activeTab === 'hybrid' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hybrid')}
                >
                    Best For You
                </button>
                <button
                    className={`tab ${activeTab === 'content' ? 'active' : ''}`}
                    onClick={() => setActiveTab('content')}
                >
                    Based on Song Features
                </button>
                <button
                    className={`tab ${activeTab === 'collaborative' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collaborative')}
                >
                    Similar Listeners
                </button>
            </div>

            <div className="tab-explanation">
                {activeTab === 'hybrid' && (
                    <p>These recommendations combine both content-based and collaborative filtering for the best results.</p>
                )}
                {activeTab === 'content' && (
                    <p>These songs are recommended based on the genres, artists, and audio features similar to your favorites.</p>
                )}
                {activeTab === 'collaborative' && (
                    <p>These songs are recommended based on what other users with similar taste have enjoyed.</p>
                )}
            </div>

            <section className="recommendations-container">
                {renderTabContent()}
            </section>
        </div>
    );
};

export default Recommendations;