const express = require('express');
const router = express.Router();
const hasilController = require('../controllers/hasilController');
const auth = require('../middleware/auth'); // Sesuaikan dengan lokasi file auth Anda

router.get(
    "/",
    auth.isAuthenticated,
    hasilController.index
);

module.exports = router;