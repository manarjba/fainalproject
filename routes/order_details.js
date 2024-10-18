const express = require('express');
const router = express.Router();
const db = require('../db');

// استرجاع تفاصيل الطلبات بواسطة order_id
router.get('/:order_id', (req, res) => {
  const orderId = req.params.order_id;
  db.query('SELECT * FROM order_details WHERE order_id = ?', [orderId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// إضافة تفاصيل طلب جديد
router.post('/', (req, res) => {
  const { order_id, book_id, quantity, price } = req.body;
  db.query(
    'INSERT INTO order_details (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
    [order_id, book_id, quantity, price],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ detail_id: results.insertId });
      }
    }
  );
});

// تحديث تفاصيل طلب محددة بواسطة detail_id
router.put('/:detail_id', (req, res) => {
  const detailId = req.params.detail_id;
  const { order_id, book_id, quantity, price } = req.body;
  db.query(
    'UPDATE order_details SET order_id = ?, book_id = ?, quantity = ?, price = ? WHERE detail_id = ?',
    [order_id, book_id, quantity, price, detailId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ message: 'Order detail updated successfully' });
      }
    }
  );
});

// حذف تفاصيل طلب محددة بواسطة detail_id
router.delete('/:detail_id', (req, res) => {
  const detailId = req.params.detail_id;
  db.query('DELETE FROM order_details WHERE detail_id = ?', [detailId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Order detail deleted successfully' });
    }
  });
});

module.exports = router;
