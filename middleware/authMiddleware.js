const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    
    // Return JSON error instead of plain text
    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = verified;
        next();
    } catch (err) {
        // Return JSON error for invalid tokens
        res.status(400).json({ message: 'Invalid Token' });
    }
};