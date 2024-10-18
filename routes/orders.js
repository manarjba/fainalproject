const express = require('express');
const router = express.Router();
const db = require('../db');

// إضافة طلب جديد
router.post('/', (req, res) => {
    const { user_id, shipping_id, order_date, status, books } = req.body;

    // إدخال الطلب إلى قاعدة البيانات، بما في ذلك shipping_id
    const orderQuery = 'INSERT INTO orders (user_id1, shipping_id, total_price, order_date, status) VALUES (?, ?, ?, ?, ?)';
    const total_price = books.reduce((sum, book) => sum + book.price * book.quantity, 0); // احسب السعر الإجمالي

    db.query(orderQuery, [user_id, shipping_id, total_price, order_date, status], (err, results) => {
        if (err) {
            console.error('Error inserting order:', err);
            return res.status(500).json({ error: 'Error adding order' });
        }

        const order_id = results.insertId;

       
    });
});

// استرجاع تفاصيل الطلب باستخدام order_id
router.get('/:order_id', (req, res) => {
    const orderId = req.params.order_id;

    const query = `
        SELECT o.order_id, o.order_date, o.total_price, o.status,
               s.first_name, s.last_name, s.address, s.city, s.postal_code, s.country, s.phone_number
        FROM orders o
        JOIN shipping_info s ON o.shipping_id = s.shipping_id
        WHERE o.order_id = ?
    `;

    db.query(query, [orderId], (err, results) => {
        if (err) {
            console.error('Error fetching order details:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(results[0]);
    });
});

router.get('/user/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM orders WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
