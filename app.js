// app.js

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
const session = require('express-session');



// إعداد الـ session
app.use(session({
  secret: 'yourSecretKey', // ضع مفتاحًا سريًا لحماية الجلسات
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ضعها true إذا كنت تستخدم HTTPS
}));

// استخدام JSON middleware وCORS
app.use(express.json());
app.use(cors());

// إعداد مجلد الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public'))); // تأكد من وضع ملفات HTML في مجلد 'public'


// استيراد المسارات
const booksRouter = require('./routes/books.js');
const cartRouter = require('./routes/cart.js');
const cartItemsRouter = require('./routes/cart_items.js');
const usersRouter = require('./routes/users.js');
const ordersRouter = require('./routes/orders');
const orderDetailsRouter = require('./routes/order_details.js');
const categoriesRouter = require('./routes/categories.js');
const loginRouter = require('./routes/login.js'); // استيراد مسار تسجيل الدخول
const checkoutRouter = require('./routes/checkout.js'); // استيراد مسار Checkout


// استخدام المسارات
app.use('/books', booksRouter);
app.use('/cart', cartRouter);
app.use('/cart-items', cartItemsRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/order-details', orderDetailsRouter);
app.use('/categories', categoriesRouter);
app.use('/login', loginRouter); // إضافة مسار تسجيل الدخول
app.use('/checkout', checkoutRouter); // إضافة مسار Checkout




// إعداد المسارات لصفحات HTML
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'orders.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});



// التعامل مع المسارات غير الموجودة
app.use((req, res, next) => {
  res.status(404).json({ error: 'المسار غير موجود' });
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



// اختبار الاتصال بقاعدة البيانات
const db = require('./db');

db.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) {
    console.error('خطأ في الاستعلام:', err);
  } else {
    console.log('النتيجة:', results[0].solution);
  }
});

app.use('/uploads', express.static('uploads'));
