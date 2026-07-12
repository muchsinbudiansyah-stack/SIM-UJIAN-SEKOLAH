const express = require("express");

const router = express.Router();

const laporanController = require("../controllers/laporanController");

// ======================================
// HALAMAN LAPORAN
// ======================================

router.get(

    "/",

    laporanController.index

);

module.exports = router;