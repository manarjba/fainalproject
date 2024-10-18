const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');



// استرجاع جميع المستخدمين
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// استرجاع مستخدم محدد بواسطة user_id
router.get('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results[0]);
    }
  });
});

// إضافة مستخدم جديد
router.post('/', (req, res) => {
  const { username, email, password, role } = req.body;
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format to 'YYYY-MM-DD HH:MM:SS'

  // تشفير كلمة المرور
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Password hashing error' });
    }

    db.query(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, createdAt],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).json({ user_id: results.insertId });
        }
      }
    );
  });
});


// تحديث مستخدم محدد بواسطة user_id
router.put('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { username, email, role } = req.body;
  // تحقق من أن المستخدم هو أدمن
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
}

  const query = `UPDATE users SET username = ?, email = ?, role = ? WHERE user_id = ?`;
  db.query(query, [username, email, role, userId], (err, results) => {
      if (err) {
          console.error('Error updating user:', err); // إضافة سجل خطأ
          return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully' });
  });
});

// حذف مستخدم محدد بواسطة user_id
router.delete('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  db.query('DELETE FROM users WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  });
});




module.exports = router;
