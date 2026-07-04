const path = require("path");

exports.uploadEditorImage = (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "File gambar tidak ditemukan."
            });
        }

        return res.json({

            location:
                "/uploads/gambar/soal/" +
                req.file.filename

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};