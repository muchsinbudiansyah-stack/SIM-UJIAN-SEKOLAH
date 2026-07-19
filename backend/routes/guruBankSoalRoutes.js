const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const controller = require("../controllers/guruBankSoalController");

// ============================
// DAFTAR SOAL SAYA
// ============================
router.get(
    "/",
    auth.isGuru,
    controller.index
);

// ============================
// FORM TAMBAH SOAL
// ============================
router.get(
    "/tambah",
    auth.isGuru,
    controller.tambah
);

// ============================
// SIMPAN SOAL
// ============================
router.post(
    "/simpan",
    auth.isGuru,
    controller.simpan
);

// ============================
// FORM EDIT
// ============================
router.get(
    "/edit/:id",
    auth.isGuru,
    controller.edit
);

// ============================
// UPDATE SOAL
// ============================
router.post(
    "/update/:id",
    auth.isGuru,
    controller.update
);

// ============================
// HAPUS SOAL
// ============================
router.get(
    "/hapus/:id",
    auth.isGuru,
    controller.hapus
);

module.exports = router;