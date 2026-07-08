const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Import middleware and routes
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Use routes
app.use('/auth', authRoutes);
// Apply middleware ONLY to product routes
app.use('/products', authMiddleware, productRoutes);

app.listen(3000, () => console.log('Server is running on port 3000'));