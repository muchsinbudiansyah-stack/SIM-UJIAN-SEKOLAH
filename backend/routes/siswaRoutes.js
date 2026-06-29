const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const siswaController = require("../controllers/siswaController");

// ======================================
// DAFTAR SISWA
// ======================================
router.get(
    "/",
    auth.isAuthenticated,
    siswaController.index
);

// ======================================
// FORM TAMBAH
// ======================================
router.get(
    "/tambah",
    auth.isAuthenticated,
    siswaController.tambah
);

// ======================================
// SIMPAN
// ======================================
router.post(
    "/simpan",
    auth.isAuthenticated,
    siswaController.simpan
);

// ======================================
// FORM EDIT
// ======================================
router.get(
    "/edit/:id",
    auth.isAuthenticated,
    siswaController.edit
);

// ======================================
// UPDATE
// ======================================
router.post(
    "/update/:id",
    auth.isAuthenticated,
    siswaController.update
);

// ======================================
// HAPUS
// ======================================
router.get(
    "/hapus/:id",
    auth.isAuthenticated,
    siswaController.hapus
);

module.exports = router;