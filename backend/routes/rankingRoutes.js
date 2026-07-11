const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const rankingController = require("../controllers/rankingController");

// ======================================
// HALAMAN RANKING
// ======================================

router.get(

    "/",

    auth.isAuthenticated,

    rankingController.index

);

module.exports = router;