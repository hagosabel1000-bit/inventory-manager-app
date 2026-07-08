const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Change if your MySQL username is different
    password: '1111',      // Add your MySQL password here if you have one
    database: 'inventory_db'
});

connection.connect((err) => {
    if (err) {
        console.error('CRITICAL ERROR: Could not connect to MySQL');
        console.error('Error message:', err.message);
        return;
    }
    console.log('Connected to the MySQL database!');
});

module.exports = connection;