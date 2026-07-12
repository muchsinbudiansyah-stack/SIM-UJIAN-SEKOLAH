const express = require("express");

const router = express.Router();

const butirController = require("../controllers/butirController");

// ======================================
// ANALISIS BUTIR SOAL
// ======================================

router.get(

    "/",

    butirController.index

);

module.exports = router;