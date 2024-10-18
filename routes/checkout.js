const express = require('express');
const router = express.Router();
const db = require('../db');

// معالجة طلب الـ Checkout
router.post('/:user_id1', async (req, res) => {
    const userId1 = req.params.user_id1; // احصل على user_id1 من الـ URL
    const { first_name, last_name, address, city, postal_code, country, phone_number, cart_items } = req.body;

    if (!userId1) {
        return res.status(403).json({ message: 'User not authenticated' });
    }

    try {
        // إدخال معلومات الشحن
        const shippingQuery = `
            INSERT INTO shipping_info (user_id1, first_name, last_name, address, city, postal_code, country, phone_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [shippingResult] = await db.promise().query(shippingQuery, [
            userId1,
            first_name,
            last_name,
            address,
            city,
            postal_code,
            country,
            phone_number
        ]);

        const shipping_id = shippingResult.insertId;

        // حساب المبلغ الإجمالي
        const totalAmount = cart_items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // إدخال بيانات الطلب
        const orderQuery = `
            INSERT INTO orders (user_id1, shipping_id, total_price, status)
            VALUES (?, ?, ?, 'Pending')
        `;

        const [orderResult] = await db.promise().query(orderQuery, [
            userId1,
            shipping_id,
            totalAmount
        ]);

        const order_id = orderResult.insertId;

        // هنا، لم يعد لديك أي تفاصيل طلب لإضافتها، لذا يمكنك تجاوز هذا الجزء.

        res.status(200).json({ message: 'Order placed successfully', order_id });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Failed to process checkout' });
    }
});

module.exports = router;
