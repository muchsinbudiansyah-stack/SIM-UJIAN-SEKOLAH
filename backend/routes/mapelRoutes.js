const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const mapelController = require("../controllers/mapelController");

// ======================================
// DAFTAR MAPEL
// ======================================
router.get(
    "/",
    auth.isAuthenticated,
    mapelController.index
);

// ======================================
// FORM TAMBAH MAPEL
// ======================================
router.get(
    "/tambah",
    auth.isAuthenticated,
    mapelController.tambah
);

// ======================================
// SIMPAN MAPEL
// ======================================
router.post(
    "/simpan",
    auth.isAuthenticated,
    mapelController.simpan
);

// ======================================
// FORM EDIT MAPEL
// ======================================
router.get(
    "/edit/:id",
    auth.isAuthenticated,
    mapelController.edit
);

// ======================================
// UPDATE MAPEL
// ======================================
router.post(
    "/update/:id",
    auth.isAuthenticated,
    mapelController.update
);

// ======================================
// HAPUS MAPEL
// ======================================
router.get(
    "/hapus/:id",
    auth.isAuthenticated,
    mapelController.hapus
);

module.exports = router;