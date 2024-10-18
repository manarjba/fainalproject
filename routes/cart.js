const express = require('express');
const router = express.Router();
const db = require('../db');

// استرجاع سلة خاصة بمستخدم معين أو إنشائها إذا لم تكن موجودة
router.get('/user/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    console.log('User ID:', userId);

    try {
        // الحصول على cart_id أو إنشائها إذا لم تكن موجودة
        const cartId = await getOrCreateCart(userId);
        console.log('Cart ID:', cartId);

        // البحث عن تفاصيل السلة باستخدام cart_id
        db.query('SELECT * FROM cart WHERE cart_id = ?', [cartId], (err, results) => {
            if (err) {
                console.error('Error fetching cart details:', err);
                return res.status(500).json({ error: err.message });
            } else if (results.length === 0) {
                return res.status(404).json({ error: 'Cart not found' });
            } else {
                res.json(results[0]);
            }
        });
    } catch (error) {
        console.error('Error in /user/:user_id route:', error);
        return res.status(500).json({ error: 'Failed to get or create cart' });
    }
});

// إضافة عنصر جديد إلى السلة
router.post('/items', (req, res) => {
    const { cart_id, book_id1, quantity } = req.body;

    // تحقق من المدخلات
    if (isNaN(cart_id) || isNaN(book_id1) || isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    db.query(
        'INSERT INTO cart_items (cart_id, book_id1, quantity) VALUES (?, ?, ?)',
        [cart_id, book_id1, quantity],
        (err, results) => {
            if (err) {
                console.error('Error inserting into cart_items:', err);
                return res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ item_id: results.insertId });
            }
        }
    );
});

// إضافة سلة جديدة
router.post('/', (req, res) => {
    const { user_id } = req.body;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!user_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.query(
        'INSERT INTO cart (user_id, created_at) VALUES (?, ?)',
        [user_id, created_at],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ cart_id: results.insertId });
            }
        }
    );
});

// تحديث سلة محددة بواسطة cart_id
router.put('/:cart_id', (req, res) => {
    const cartId = req.params.cart_id;
    const { user_id, created_at } = req.body;

    if (!user_id || !created_at) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.query(
        'UPDATE cart SET user_id = ?, created_at = ? WHERE cart_id = ?',
        [user_id, created_at, cartId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({ message: 'Cart updated successfully' });
            }
        }
    );
});

// حذف سلة محددة بواسطة cart_id
router.delete('/:cart_id', (req, res) => {
    const cartId = req.params.cart_id;

    db.query('SELECT * FROM cart WHERE cart_id = ?', [cartId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        db.query('DELETE FROM cart WHERE cart_id = ?', [cartId], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({ message: 'Cart deleted successfully' });
            }
        });
    });
});

// دالة للحصول على سلة أو إنشائها إذا لم تكن موجودة
async function getOrCreateCart(userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId], (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length > 0) {
                resolve(results[0].cart_id);
            } else {
                const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
                db.query('INSERT INTO cart (user_id, created_at) VALUES (?, ?)', [userId, createdAt], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results.insertId);
                });
            }
        });
    });
}

// استرجاع عناصر السلة
router.get('/cart-items/:cartId', (req, res) => {
    const cartId = req.params.cartId;

    const query = `
        SELECT ci.item_id, b.title AS book_title, ci.quantity, b.price AS book_price
        FROM cart_items ci
        JOIN books b ON ci.book_id1 = b.book_ID
        WHERE ci.cart_id = ?
    `;

    db.query(query, [cartId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


// استرجاع user_id بناءً على cart_id
router.get('/get-user-from-cart/:cartId', (req, res) => {
    const cartId = req.params.cartId;

    db.query('SELECT user_id FROM cart WHERE cart_id = ?', [cartId], (err, results) => {
        if (err) {
            console.error('Error fetching user ID from cart:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json({ user_id: results[0].user_id });
    });
});

module.exports = router;
