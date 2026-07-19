const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const laporanGuruController = require("../controllers/laporanGuruController");

router.get(

    "/laporan/:ujianId",

    auth.isGuru,

    laporanGuruController.printLaporan

);

module.exports = router;