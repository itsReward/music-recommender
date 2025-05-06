// middleware/auth.js
const auth = (req, res, next) => {
    // Extract username from header (no validation)
    const username = req.header('x-username');

    // Find user ID based on username
    if (username === 'john_doe') {
        req.user = { id: 'user_1' };
    } else if (username === 'jane_smith') {
        req.user = { id: 'user_2' };
    } else if (username === 'alex_rock') {
        req.user = { id: 'user_3' };
    } else {
        // Default to john_doe if username not recognized
        req.user = { id: 'user_1' };
    }

    next();
};

module.exports = auth;