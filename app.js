const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const session = require('express-session');
const app = express();

// Setup untuk body-parser dan session
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Parsing JSON jika diperlukan
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Setup koneksi ke MySQL (hospitaldb)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',   // Ganti dengan username MySQL Anda
  password: '',   // Ganti dengan password MySQL Anda
  database: 'hospitaldb'  // Ganti dengan nama database Anda
});

// Koneksi ke database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Setup untuk EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Rute untuk halaman login
app.get('/login', (req, res) => {
  res.render('login');  // Menampilkan halaman login.ejs
});

// Rute POST untuk login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query untuk mencari user berdasarkan username
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).send('Error fetching data');
    if (results.length === 0) return res.status(400).send('User not found');

    // Memeriksa apakah password yang dimasukkan cocok dengan yang ada di database
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) return res.status(500).send('Error checking password');
      if (!isMatch) return res.status(401).send('Incorrect password');

      // Simpan userId dalam session setelah login berhasil
      req.session.userId = results[0].id;
      res.redirect('/patients');  // Arahkan ke halaman data pasien setelah login berhasil
    });
  });
});

// Rute untuk halaman signup
app.get('/signup', (req, res) => {
  res.render('signup');  // Tampilkan halaman signup.ejs
});

// Rute POST untuk signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error hashing password');

    // Simpan user ke database
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
      if (err) return res.status(500).send('Error registering user');
      res.redirect('/login');  // Setelah berhasil daftar, arahkan ke halaman login
    });
  });
});

// Halaman untuk melihat data pasien (setelah login)
app.get('/patients', (req, res) => {
  // Pastikan user sudah login
  if (!req.session.userId) {
    return res.redirect('/login');  // Jika belum login, arahkan ke halaman login
  }

  // Query untuk mengambil data pasien
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) return res.status(500).send('Error fetching data');
    res.render('patients', { patients: results });  // Tampilkan data pasien
  });
});

// Menjalankan server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
