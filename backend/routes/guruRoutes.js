const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const guruController = require("../controllers/guruController");

// ======================================
// DAFTAR GURU
// ======================================
router.get(
    "/",
    auth.isAuthenticated,
    guruController.index
);

// ======================================
// FORM TAMBAH
// ======================================
router.get(
    "/tambah",
    auth.isAuthenticated,
    guruController.tambah
);

// ======================================
// SIMPAN DATA
// ======================================
router.post(
    "/simpan",
    auth.isAuthenticated,
    guruController.simpan
);

// ======================================
// FORM EDIT
// ======================================
router.get(
    "/edit/:id",
    auth.isAuthenticated,
    guruController.edit
);

// ======================================
// UPDATE DATA
// ======================================
router.post(
    "/update/:id",
    auth.isAuthenticated,
    guruController.update
);

// ======================================
// HAPUS DATA
// ======================================
router.get(
    "/hapus/:id",
    auth.isAuthenticated,
    guruController.hapus
);

module.exports = router;