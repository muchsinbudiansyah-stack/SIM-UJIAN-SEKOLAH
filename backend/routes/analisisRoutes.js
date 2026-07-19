const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const analisisController = require("../controllers/analisisController");

// Dashboard Analisis Admin
router.get(
    "/",
    auth.isAdmin,
    analisisController.index
);

module.exports = router;