const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const uploadSoal = require("../middleware/uploadSoal");

const uploadController =
require("../controllers/uploadController");

router.post(
    "/editor-image",
    auth.isAuthenticated,
    uploadSoal.single("file"),
    uploadController.uploadEditorImage
);

module.exports = router;