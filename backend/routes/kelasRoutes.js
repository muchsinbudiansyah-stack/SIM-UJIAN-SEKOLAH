const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const kelasController = require("../controllers/kelasController");

// ======================================
// DAFTAR KELAS
// ======================================
router.get(
    "/",
    auth.isAuthenticated,
    kelasController.index
);

// ======================================
// FORM TAMBAH
// ======================================
router.get(
    "/tambah",
    auth.isAuthenticated,
    kelasController.tambah
);

// ======================================
// SIMPAN DATA
// ======================================
router.post(
    "/simpan",
    auth.isAuthenticated,
    kelasController.simpan
);

// ======================================
// FORM EDIT
// ======================================
router.get(
    "/edit/:id",
    auth.isAuthenticated,
    kelasController.edit
);

// ======================================
// UPDATE DATA
// ======================================
router.post(
    "/update/:id",
    auth.isAuthenticated,
    kelasController.update
);

// ======================================
// HAPUS DATA
// ======================================
router.get(
    "/hapus/:id",
    auth.isAuthenticated,
    kelasController.hapus
);

module.exports = router;