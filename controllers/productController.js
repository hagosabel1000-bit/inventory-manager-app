const db = require('../models/db');

exports.getAllProducts = (req, res) => {
    // Make sure your SQL query selects the new column
    db.query('SELECT id, name, quantity, created_by FROM products', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};

exports.addProduct = (req, res) => {
    // Check what we are receiving
    console.log("DEBUG: Data received:", req.body); 
    
    const { name, quantity } = req.body;
    // Get the username from the token provided by authMiddleware
    const username = req.user ? req.user.username : 'Unknown';
    
    // Check to prevent crashing if data is missing
    if (!name || !quantity) {
        return res.status(400).send("Name and Quantity are required");
    }

    // Updated Query: Included 'created_by' column
    db.query('INSERT INTO products (name, quantity, created_by) VALUES (?, ?, ?)', 
    [name, quantity, username], (err, result) => {
        if (err) {
            console.error("DEBUG: Database Error:", err); 
            return res.status(500).send('Error adding product');
        }
        res.status(201).send('Product added successfully');
    });
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting product' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    });
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    db.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating product' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated' });
    });
};

exports.sellProduct = (req, res) => {
    const { id, quantitySold, productName } = req.body;
    
    // Now this will work because the token has the username
    const username = req.user.username; 

    db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [quantitySold, id], (err) => {
        if (err) return res.status(500).json({ message: 'Error updating stock' });

        db.query('INSERT INTO transactions (product_name, quantity_sold, username) VALUES (?, ?, ?)', 
        [productName, quantitySold, username], (err) => {
            if (err) return res.status(500).json({ message: 'Error logging transaction' });
            res.json({ message: 'Sale completed and logged' });
        });
    });
};

exports.getTransactions = (req, res) => {
    // This SQL query gets all records sorted by the newest date first
    db.query('SELECT * FROM transactions ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: 'Error fetching transactions' });
        }
        res.json(results);
    });
};