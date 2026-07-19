const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================
// FOLDER UPLOAD
// ======================================

const folderGambar = path.join(
    __dirname,
    "../../uploads/gambar/soal"
);

const folderAudio = path.join(
    __dirname,
    "../../uploads/audio/soal"
);

const folderVideo = path.join(
    __dirname,
    "../../uploads/video/soal"
);

// ======================================
// PASTIKAN FOLDER ADA
// ======================================

[
    folderGambar,
    folderAudio,
    folderVideo
].forEach(folder => {

    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder, { recursive: true });

    }

});

// ======================================
// STORAGE
// ======================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (file.fieldname === "gambar") {

            return cb(null, folderGambar);

        }

        if (file.fieldname === "audio") {

            return cb(null, folderAudio);

        }

        if (file.fieldname === "video") {

            return cb(null, folderVideo);

        }

        cb(new Error("Jenis file tidak dikenali"));

    },

    filename: function (req, file, cb) {

        const ext = path.extname(file.originalname);

        const namaFile =

            Date.now() +

            "-" +

            Math.round(Math.random() * 100000) +

            ext.toLowerCase();

        cb(null, namaFile);

    }

});

// ======================================
// FILTER FILE
// ======================================

const gambar = [

    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif"

];

const audio = [

    ".mp3",
    ".wav",
    ".ogg",
    ".m4a"

];

const video = [

    ".mp4",
    ".webm",
    ".mov",
    ".avi",
    ".mkv"

];

const fileFilter = (req, file, cb) => {

    const ext = path.extname(file.originalname).toLowerCase();

    if (

        file.fieldname === "gambar" &&
        gambar.includes(ext)

    ) {

        return cb(null, true);

    }

    if (

        file.fieldname === "audio" &&
        audio.includes(ext)

    ) {

        return cb(null, true);

    }

    if (

        file.fieldname === "video" &&
        video.includes(ext)

    ) {

        return cb(null, true);

    }

    cb(new Error("Format file tidak didukung."));

};

// ======================================
// MULTER
// ======================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 100 * 1024 * 1024 // 100 MB

    }

});

module.exports = upload;