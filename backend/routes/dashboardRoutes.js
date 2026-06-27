const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const dashboardController = require("../controllers/dashboardController");

// =====================================
// DASHBOARD ADMIN
// =====================================
router.get(
    "/",
    auth.isAuthenticated,
    dashboardController.index
);

module.exports = router;