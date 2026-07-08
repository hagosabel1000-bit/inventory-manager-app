const jwt = require('jsonwebtoken');
const config = require('../config');

// middleware/authMiddleware.js
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Split the header to get the token part after 'Bearer '
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, 'my_seccret_key_123');
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};