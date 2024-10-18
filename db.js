const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123445544661.', // تأكد من وضع كلمة المرور هنا
  database: 'online_bookstore' // تأكد من وضع اسم قاعدة البيانات هنا
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = db;
