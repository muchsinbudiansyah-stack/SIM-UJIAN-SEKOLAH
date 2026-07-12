const express = require("express");

const router = express.Router();

const analisisController = require("../controllers/analisisController");

// ======================================
// HALAMAN ANALISIS
// ======================================

router.get(

    "/",

    analisisController.index

);

module.exports = router;