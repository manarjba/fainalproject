const express = require('express');
const router = express.Router();
const db = require('../db');

// استرجاع جميع الكتب
router.get('/', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// استرجاع كتاب محدد بواسطة book_ID
router.get('/:book_ID', (req, res) => {
  const bookId = req.params.book_ID;
  db.query('SELECT * FROM books WHERE book_ID = ?', [bookId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results[0]);
    }
  });
});

// إضافة كتاب جديد
router.post('/', (req, res) => {
  const { title, author, price, category, description, stock } = req.body;
  const now = new Date();
  const created_at = now.toISOString().slice(0, 19).replace('T', ' ');
  db.query(
    'INSERT INTO books (title, author, price, category, description, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, author, price, category, description, stock, created_at],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ book_ID: results.insertId });
      }
    }
  );
});

// تحديث كتاب محدد بواسطة book_ID
router.put('/:book_id', (req, res) => {
  const bookId = req.params.book_id;
  const { title, author, price, category, description, stock } = req.body;

  const query = `UPDATE books SET title = ?, author = ?, price = ?, category = ?, description = ?, stock = ? WHERE book_ID = ?`;
  db.query(query, [title, author, price, category, description, stock, bookId], (err, results) => {
      if (err) {
          console.error('Error updating book:', err); // إضافة سجل خطأ
          return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({ message: 'Book updated successfully' });
  });
});


// حذف كتاب محدد بواسطة book_ID
router.delete('/:book_ID', (req, res) => {
  const bookId = req.params.book_ID;
  db.query('DELETE FROM books WHERE book_ID = ?', [bookId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  });
});

module.exports = router;
