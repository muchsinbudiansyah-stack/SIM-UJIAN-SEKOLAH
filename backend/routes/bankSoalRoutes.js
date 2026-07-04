const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const bankSoalController = require("../controllers/bankSoalController");
const uploadSoal = require("../middleware/uploadSoal");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================
// PASTIKAN FOLDER UPLOAD ADA
// ======================================

const uploadFolder = path.join(__dirname, "../../uploads/word");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// ======================================
// KONFIGURASI MULTER
// ======================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },

    filename: function (req, file, cb) {

        const namaFile =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_");

        cb(null, namaFile);

    }

});

const upload = multer({

    storage,

    fileFilter: (req, file, cb) => {

        if (
            file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {

            cb(null, true);

        } else {

            cb(new Error("File harus .docx"));

        }

    }

});

// ======================================
// DAFTAR SOAL
// ======================================

router.get(
    "/",
    auth.isAuthenticated,
    bankSoalController.index
);

router.get(
    "/mapel/:id",
    auth.isAuthenticated,
    bankSoalController.getByMapel
);

// ======================================
// FORM TAMBAH
// ======================================

router.get(
    "/tambah",
    auth.isAuthenticated,
    bankSoalController.tambah
);

// ======================================
// SIMPAN
// ======================================

router.post(
    "/simpan",
    auth.isAuthenticated,
    uploadSoal.single("gambar"),
    bankSoalController.simpan
);

// ======================================
// FORM EDIT
// ======================================

router.get(
    "/edit/:id",
    auth.isAuthenticated,
    bankSoalController.edit
);

// ======================================
// UPDATE
// ======================================

router.post(
    "/update/:id",
    auth.isAuthenticated,
    uploadSoal.single("gambar"),
    bankSoalController.update
);

// ======================================
// HAPUS
// ======================================

router.get(
    "/hapus/:id",
    auth.isAuthenticated,
    bankSoalController.hapus
);

// ======================================
// IMPORT WORD
// ======================================

router.get(
    "/import-word",
    auth.isAuthenticated,
    bankSoalController.showImportWord
);

router.post(
    "/import-word",
    auth.isAuthenticated,
    upload.single("fileWord"),
    bankSoalController.importWord
);

// ======================================
// IMPORT KE DATABASE
// ======================================
router.post(
    "/import-database",
    auth.isAuthenticated,
    bankSoalController.importDatabase
);

module.exports = router;