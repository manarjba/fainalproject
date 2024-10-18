const express = require('express');
const router = express.Router();
const db = require('../db');

// استرجاع جميع الفئات
router.get('/', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// استرجاع فئة محددة بواسطة category_id
router.get('/:category_id', (req, res) => {
  const categoryId = req.params.category_id;
  db.query('SELECT * FROM categories WHERE category_id = ?', [categoryId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results[0]);
    }
  });
});

// إضافة فئة جديدة
router.post('/', (req, res) => {
  const { category_name } = req.body;
  db.query(
    'INSERT INTO categories (category_name) VALUES (?)',
    [category_name],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ category_id: results.insertId });
      }
    }
  );
});

// تحديث فئة محددة بواسطة category_id
router.put('/:category_id', (req, res) => {
  const categoryId = req.params.category_id;
  const { category_name } = req.body;
  db.query(
    'UPDATE categories SET category_name = ? WHERE category_id = ?',
    [category_name, categoryId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ message: 'Category updated successfully' });
      }
    }
  );
});

// حذف فئة محددة بواسطة category_id
router.delete('/:category_id', (req, res) => {
  const categoryId = req.params.category_id;
  db.query('DELETE FROM categories WHERE category_id = ?', [categoryId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Category deleted successfully' });
    }
  });
});

module.exports = router;
