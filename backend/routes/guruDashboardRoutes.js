const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const guruDashboardController = require("../controllers/guruDashboardController");

router.get(

    "/",

    auth.isGuru,

    guruDashboardController.index

);

module.exports = router;