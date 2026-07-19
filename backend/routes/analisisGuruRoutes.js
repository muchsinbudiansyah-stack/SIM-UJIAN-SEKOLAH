const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const analisisGuruController = require("../controllers/analisisGuruController");

router.get(
    "/",
    auth.isGuru,
    analisisGuruController.index
);

module.exports = router;