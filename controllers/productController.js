const db = require('../models/db');

exports.getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching products' });
        res.json(results);
    });
};

exports.addProduct = (req, res) => {
    console.log("DEBUG: Data received:", req.body); // Check your terminal!
    const { name, quantity } = req.body;
    
    // Add a check to prevent crashing if data is missing
    if (!name || !quantity) {
        return res.status(400).send("Name and Quantity are required");
    }

    db.query('INSERT INTO products (name, quantity) VALUES (?, ?)', [name, quantity], (err, result) => {
        if (err) {
            console.error("DEBUG: Database Error:", err); // This is the gold mine for fixing 500s
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