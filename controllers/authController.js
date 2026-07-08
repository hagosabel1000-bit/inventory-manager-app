const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', 
        [username, hashedPassword], (err, result) => {
            if (err) {
                // ADD THIS LINE TO SEE THE REAL ERROR IN YOUR VS CODE TERMINAL
                console.error('DATABASE ERROR:', err);
                return res.status(500).send(err.message);
            }
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        console.error('BCRYPT ERROR:', error);
        res.status(500).send(error.message);
    }
};
//Controller for handling user login
exports.login = (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send('User not found');
        const isMatch = await bcrypt.compare(password, results[0].password);
        if (!isMatch) return res.status(401).send('Invalid credentials');
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    });
};