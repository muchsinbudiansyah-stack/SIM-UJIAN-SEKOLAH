const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const monitorController = require("../controllers/monitorController");

// ======================================
// HALAMAN MONITOR
// ======================================

router.get(

    "/",

    auth.isAuthenticated,

    monitorController.index

);

// ======================================
// API REALTIME
// ======================================

router.get(

    "/realtime",

    auth.isAuthenticated,

    monitorController.realtime

);

module.exports = router;