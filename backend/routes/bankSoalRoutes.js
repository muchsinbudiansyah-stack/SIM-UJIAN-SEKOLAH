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

const uploadWordFolder = path.join(__dirname, "../../uploads/word");

if (!fs.existsSync(uploadWordFolder)) {
    fs.mkdirSync(uploadWordFolder, { recursive: true });
}

// ======================================
// IMPORT WORD
// ======================================

const storageWord = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadWordFolder);

    },

    filename: function (req, file, cb) {

        cb(

            null,

            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_")

        );

    }

});

const uploadWord = multer({

    storage: storageWord,

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
    auth.isGuruOrAdmin,
    bankSoalController.index
);

router.get(
    "/mapel/:id",
    auth.isGuruOrAdmin,
    bankSoalController.getByMapel
);

// ======================================
// FORM TAMBAH
// ======================================

router.get(
    "/tambah",
    auth.isGuruOrAdmin,
    bankSoalController.tambah
);

// ======================================
// SIMPAN
// ======================================

router.post(

    "/simpan",

    auth.isGuruOrAdmin,

    uploadSoal.fields([

        {
            name: "gambar",
            maxCount: 1
        },

        {
            name: "audio",
            maxCount: 1
        },

        {
            name: "video",
            maxCount: 1
        }

    ]),

    bankSoalController.simpan

);

// ======================================
// FORM EDIT
// ======================================

router.get(

    "/edit/:id",

    auth.isGuruOrAdmin,

    bankSoalController.edit

);

// ======================================
// UPDATE
// ======================================

router.post(

    "/update/:id",

    auth.isGuruOrAdmin,

    uploadSoal.fields([

        {
            name: "gambar",
            maxCount: 1
        },

        {
            name: "audio",
            maxCount: 1
        },

        {
            name: "video",
            maxCount: 1
        }

    ]),

    bankSoalController.update

);

// ======================================
// HAPUS
// ======================================

router.get(

    "/hapus/:id",

    auth.isGuruOrAdmin,

    bankSoalController.hapus

);

// ======================================
// IMPORT WORD
// ======================================

router.get(

    "/import-word",

    auth.isGuruOrAdmin,

    bankSoalController.showImportWord

);

router.post(

    "/import-word",

    auth.isGuruOrAdmin,

    uploadWord.single("fileWord"),

    bankSoalController.importWord

);

// ======================================
// IMPORT DATABASE
// ======================================

router.post(

    "/import-database",

    auth.isGuruOrAdmin,

    bankSoalController.importDatabase

);

module.exports = router;