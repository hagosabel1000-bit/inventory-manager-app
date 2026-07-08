const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./models/db'); // Ensure the database connection is established

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Required: Meaningful request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.send('Inventory Management System API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});