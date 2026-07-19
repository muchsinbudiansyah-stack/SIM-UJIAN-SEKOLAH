const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const rankingGuruController = require("../controllers/rankingGuruController");

router.get(
    "/",
    auth.isGuru,
    rankingGuruController.index
);

router.get(

    "/excel/:ujianId",

    auth.isGuru,

    rankingGuruController.exportExcel

);

router.get(

    "/pdf/:ujianId",

    auth.isGuru,

    rankingGuruController.exportPDF

);

router.get(

    "/print/:ujianId",

    auth.isGuru,

    rankingGuruController.printRanking

);

module.exports = router;