const multer = require("multer");
const path = require("path");
const fs = require("fs");

const folder = path.join(
    __dirname,
    "../../uploads/gambar/soal"
);

// Pastikan folder ada
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, folder);

    },

    filename: function (req, file, cb) {

        const ext = path.extname(file.originalname);

        const namaFile =
            Date.now() +
            "-" +
            Math.round(Math.random() * 100000) +
            ext;

        cb(null, namaFile);

    }

});

const fileFilter = (req, file, cb) => {

    const ext = path.extname(file.originalname).toLowerCase();

    const allowed = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    if (allowed.includes(ext)) {

        cb(null, true);

    } else {

        cb(new Error("Format gambar tidak didukung."));

    }

};

const upload = multer({

    storage,
    fileFilter,
    limits: {

        fileSize: 5 * 1024 * 1024 // 5 MB

    }

});

module.exports = upload;