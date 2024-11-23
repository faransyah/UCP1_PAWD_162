const express = require('express');
const router = express.Router();

// Menangani GET untuk halaman daftar pasien
router.get('/patients', (req, res) => {
    // Ambil data pasien dari database dan kirim ke tampilan
    res.render('patients'); // Pastikan ada file patients.ejs di folder views
});

// Menangani POST untuk menambah pasien baru
router.post('/patients', (req, res) => {
    const { name, address, contact } = req.body;
    // Simpan data pasien ke database
    res.redirect('/patients'); // Redirect ke daftar pasien setelah berhasil
});

// Menangani GET untuk mengedit data pasien
router.get('/patients/edit/:id', (req, res) => {
    const patientId = req.params.id;
    // Ambil data pasien berdasarkan ID dan kirim ke tampilan
    res.render('editPatient'); // Pastikan ada file editPatient.ejs di folder views
});

// Menangani POST untuk memperbarui data pasien
router.post('/patients/edit/:id', (req, res) => {
    const patientId = req.params.id;
    const { name, address, contact } = req.body;
    // Perbarui data pasien di database berdasarkan ID
    res.redirect('/patients');
});

// Menangani GET untuk menghapus pasien
router.get('/patients/delete/:id', (req, res) => {
    const patientId = req.params.id;
    // Hapus data pasien dari database berdasarkan ID
    res.redirect('/patients');
});

module.exports = router;
