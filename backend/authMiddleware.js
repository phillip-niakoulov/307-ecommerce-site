const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT (DOESN'T CHECK IF ADMIN, JUST IF JWT IS VALID AND NOT EXPIRED)
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res
            .status(403)
            .json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Token has expired. Please log in again.',
                });
            }
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.id = user['userId']; // Save user id to request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateJWT;
