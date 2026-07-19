const express = require("express");
const router = express.Router();

const hasilController = require("../controllers/hasilController");
const auth = require("../middleware/auth");

// ======================================
// DAFTAR HASIL
// ======================================

router.get(

    "/",

    auth.isGuruOrAdmin,

    hasilController.index

);

// ======================================
// DETAIL HASIL
// ======================================

router.get(

    "/detail/:id",

    auth.isGuruOrAdmin,

    hasilController.detail

);

module.exports = router;