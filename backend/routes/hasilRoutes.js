const express = require("express");
const router = express.Router();

const hasilController = require("../controllers/hasilController");
const auth = require("../middleware/auth");

router.get(

    "/",

    auth.isAdmin,

    hasilController.index

);

router.get(

    "/detail/:id",

    auth.isAdmin,

    hasilController.detail

);

module.exports = router;