const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const ujianController = require("../controllers/ujianController");

// ======================================
// DAFTAR UJIAN
// ======================================
router.get(
    "/",
    auth.isAuthenticated,
    ujianController.index
);

// ======================================
// PESERTA UJIAN
// ======================================
router.get(
    "/peserta/:id",
    auth.isAuthenticated,
    ujianController.listPeserta
);

// ======================================
// FORM TAMBAH
// ======================================
router.get(
    "/tambah",
    auth.isAuthenticated,
    ujianController.tambah
);

// ======================================
// SIMPAN
// ======================================
router.post(
    "/simpan",
    auth.isAuthenticated,
    ujianController.simpan
);

// ======================================
// FORM EDIT
// ======================================
router.get(
    "/edit/:id",
    auth.isAuthenticated,
    ujianController.edit
);

// ======================================
// UPDATE
// ======================================
router.post(
    "/update/:id",
    auth.isAuthenticated,
    ujianController.update
);

// ======================================
// HAPUS
// ======================================
router.get(
    "/hapus/:id",
    auth.isAuthenticated,
    ujianController.hapus
);

module.exports = router;