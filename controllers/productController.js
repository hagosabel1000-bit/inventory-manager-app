const db = require('../models/db');

//crud operations for products
exports.getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).send('Error fetching products');
        res.json(results);
    });
};

exports.addProduct = (req, res) => {
    const { name, quantity, price } = req.body;
    db.query('INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)', 
    [name, quantity, price], (err, result) => {
        if (err) return res.status(500).send('Error adding product');
        res.status(201).send('Product added successfully');
    });
};

// Add these to productController.js
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send('Error deleting product');
        res.send('Product deleted');
    });
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    db.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id], (err, result) => {
        if (err) return res.status(500).send('Error updating product');
        res.send('Product updated');
    });
};