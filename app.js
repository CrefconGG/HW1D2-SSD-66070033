require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error occurred while retrieving products.', error: err });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/products/:id', (req, res) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving product.', error: err });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: 'Product not found.' });
      } else {
        res.status(200).json(result[0]);
      }
    }
  });
});

app.get('/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  const sql = 'SELECT * FROM products WHERE name LIKE ?';
  db.query(sql, [keyword], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error searching products.', error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// app.post('/products', (req, res) => {
//   const { name, price, discount, review_count, image_url } = req.body;
//   const sql = 'INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)';
//   db.query(sql, [name, price, discount, review_count, image_url], (err, result) => {
//     if (err) {
//       res.status(500).json({ message: 'Error occurred while adding product.', error: err });
//     } else {
//       res.status(201).json({ message: 'Product added successfully.', productId: result.insertId });
//     }
//   });
// });

// app.put('/products/:id', (req, res) => {
//   const { name, price, discount, review_count, image_url } = req.body;
//   const sql = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';
//   db.query(sql, [name, price, discount, review_count, image_url, req.params.id], (err, result) => {
//     if (err) {
//       res.status(500).json({ message: 'Error occurred while updating product.', error: err });
//     } else {
//       if (result.affectedRows === 0) {
//         res.status(404).json({ message: 'Product not found.' });
//       } else {
//         res.status(200).json({ message: 'Product updated successfully.' });
//       }
//     }
//   });
// });

// app.delete('/products/:id', (req, res) => {
//   const sql = 'DELETE FROM products WHERE id = ?';
//   db.query(sql, [req.params.id], (err, result) => {
//     if (err) {
//       res.status(500).json({ message: 'Error occurred while deleting product.', error: err });
//     } else {
//       if (result.affectedRows === 0) {
//         res.status(404).json({ message: 'Product not found.' });
//       } else {
//         res.status(200).json({ message: 'Product deleted successfully.' });
//       }
//     }
//   });
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
