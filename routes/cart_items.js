const express = require('express');
const router = express.Router();
const db = require('../db');

// استرجاع جميع عناصر السلة الخاصة بسلة معينة
router.get('/:cart_id', (req, res) => {
  const cartId = req.params.cart_id;
  db.query('SELECT books.title AS book_title, books.price AS book_price, cart_items.quantity, cart_items.item_id FROM cart_items JOIN books ON cart_items.book_id1 = books.book_ID WHERE cart_items.cart_id = ?', [cartId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No items found in this cart' });
    }
    res.json(results);
  });
});

// إضافة عنصر جديد إلى السلة
router.post('/', (req, res) => {
  const { cart_id, book_id1, quantity } = req.body;

  console.log('Received data:', req.body);

  // تحقق من صحة البيانات المدخلة
  if (!cart_id || !book_id1 || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // إذا كان cart_id غير محدد أو null، قم بتعيينه إلى null
  const validCartId = (cart_id === 'null' || !cart_id) ? null : parseInt(cart_id, 10);

  db.query(
    'INSERT INTO cart_items (cart_id, book_id1, quantity) VALUES (?, ?, ?)',
    [validCartId, book_id1, quantity],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ item_id: results.insertId });
    }
  );
});

// تحديث عنصر سلة محدد بواسطة item_id
router.put('/:item_id', (req, res) => {
  const itemId = req.params.item_id;
  const { cart_id, book_id1, quantity } = req.body;

  // تحقق من صحة البيانات المدخلة
  if (!cart_id || !book_id1 || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query('UPDATE cart_items SET cart_id = ?, book_id1 = ?, quantity = ? WHERE item_id = ?', [cart_id, book_id1, quantity, itemId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Cart item updated successfully' });
  });
});

// حذف عنصر سلة محدد بواسطة item_id
router.delete('/:item_id', (req, res) => {
  const itemId = req.params.item_id;
  db.query('DELETE FROM cart_items WHERE item_id = ?', [itemId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Cart item deleted successfully' });
  });
});

module.exports = router;
