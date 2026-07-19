const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const laporanGuruController = require("../controllers/laporanGuruController");

router.get(
    "/",
    auth.isGuru,
    laporanGuruController.index
);

router.get(
    "/excel/:ujianId",
    auth.isGuru,
    laporanGuruController.exportExcel
);

router.get(

"/pdf/:ujianId",

auth.isGuru,

laporanGuruController.exportPDF

);

module.exports = router;