// routes/login.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');


// تسجيل الدخول
router.post('/', (req, res) => {
    const { email, password } = req.body;

    // تسجيل البيانات المستلمة للتحقق
    console.log('Received email:', email);
    console.log('Received password:', password); // تأكد من عدم استخدام هذا في الإنتاج

    // استعلام قاعدة البيانات للتحقق من البريد الإلكتروني
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }

        // التحقق من عدم وجود مستخدم بالبريد الإلكتروني المدخل
        if (results.length === 0) {
            console.log('User not found with email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // مقارنة كلمة المرور المدخلة مع كلمة المرور المخزنة في قاعدة البيانات
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Password comparison error:', err);
                return res.status(500).json({ error: 'Password comparison error' });
            }

            if (!isMatch) {
                console.log('Password does not match for user:', email);
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // تسجيل الدخول بنجاح
            console.log('Login successful for user:', email);
            req.session.user_id = user.user_id; // تخزين معرف المستخدم في الجلسة
            req.session.user_role = user.role; // تخزين الدور في الجلسة
// After successful login

            res.status(200).json({ message: 'Login successful', user });

            
        });
    });
});

module.exports = router;