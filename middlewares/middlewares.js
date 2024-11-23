const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes'); // Sesuaikan dengan lokasi file authRoutes.js

const app = express();
const port = 3000;

// Middleware untuk mengurai data request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Gunakan authRoutes
app.use(authRoutes);

// Menangani route lainnya
app.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.send('Welcome to the main page!');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
