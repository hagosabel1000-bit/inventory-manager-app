const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');


exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                // If error is 1062, it means the username already exists
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username already exists' });
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
//Controller for handling user login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    // 1. Query the database
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) return res.status(401).json({ message: 'User not found' });

        const user = results[0];

        // 2. Compare the plain password with the hashed password in DB
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // 3. Success!
        const token = jwt.sign({ id: user.id, username: user.username }, 'my_seccret_key_123', { expiresIn: '1h' });
        res.json({ token });
    });
};