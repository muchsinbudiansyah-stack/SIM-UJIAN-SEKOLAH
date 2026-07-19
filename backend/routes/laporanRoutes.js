const express = require("express");

const router = express.Router();

const laporanController = require("../controllers/laporanController");

const pdfController = require("../controllers/pdfController");

const excelController = require("../controllers/excelController");

// ======================================
// HALAMAN LAPORAN
// ======================================

router.get(

    "/",

    laporanController.index

);

// ======================================
// EXPORT PDF
// ======================================

router.get(
    "/pdf",
    pdfController.export
);

router.get(
    "/excel",
    excelController.export
);

module.exports = router;