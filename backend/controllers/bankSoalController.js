const bankSoalModel = require("../models/bankSoalModel");
const mammoth = require("mammoth");
const parseWord = require("../helpers/wordParser");
const validateSoal = require("../helpers/importValidator");

// ======================================
// DAFTAR SOAL
// ======================================
exports.index = async (req, res) => {

    try {

        const soal = await bankSoalModel.getAll();

        res.render("bank-soal/index", {
            soal
        });

    } catch (err) {

        console.log(err);

        res.send("Terjadi kesalahan.");

    }

};

// ======================================
// FORM TAMBAH SOAL
// ======================================
exports.tambah = async (req, res) => {

    try {

        const mapel = await bankSoalModel.getMapel();
        const guru = await bankSoalModel.getGuru();

        res.render("bank-soal/tambah", {
            mapel,
            guru
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// SIMPAN SOAL
// ======================================
exports.simpan = async (req, res) => {

    try {

        await bankSoalModel.create({

            mapel_id: req.body.mapel_id,
            guru_id: req.body.guru_id,
            jenis: req.body.jenis,
            pertanyaan: req.body.pertanyaan,
            pilihan_a: req.body.pilihan_a,
            pilihan_b: req.body.pilihan_b,
            pilihan_c: req.body.pilihan_c,
            pilihan_d: req.body.pilihan_d,
            pilihan_e: req.body.pilihan_e,
            jawaban: req.body.jawaban,
            bobot: req.body.bobot,
            gambar: "",
            audio: "",
            video: "",
            status: req.body.status

        });

        res.redirect("/bank-soal");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM EDIT SOAL
// ======================================
exports.edit = async (req, res) => {

    try {

        const soal = await bankSoalModel.findById(req.params.id);
        const mapel = await bankSoalModel.getMapel();
        const guru = await bankSoalModel.getGuru();

        res.render("bank-soal/edit", {
            soal,
            mapel,
            guru
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// UPDATE SOAL
// ======================================
exports.update = async (req, res) => {

    try {

        await bankSoalModel.update(req.params.id, {

            mapel_id: req.body.mapel_id,
            guru_id: req.body.guru_id,
            jenis: req.body.jenis,
            pertanyaan: req.body.pertanyaan,
            pilihan_a: req.body.pilihan_a,
            pilihan_b: req.body.pilihan_b,
            pilihan_c: req.body.pilihan_c,
            pilihan_d: req.body.pilihan_d,
            pilihan_e: req.body.pilihan_e,
            jawaban: req.body.jawaban,
            bobot: req.body.bobot,
            status: req.body.status

        });

        res.redirect("/bank-soal");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HAPUS SOAL
// ======================================
exports.hapus = async (req, res) => {

    try {

        await bankSoalModel.delete(req.params.id);

        res.redirect("/bank-soal");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HALAMAN IMPORT WORD
// ======================================
exports.showImportWord = (req, res) => {

    res.render("bank-soal/import-word");

};

// ======================================
// IMPORT WORD + PREVIEW
// ======================================
exports.importWord = async (req, res) => {

    try {

        if (!req.file) {
            return res.send("Silakan pilih file Word (.docx).");
        }

        const hasil = await mammoth.extractRawText({
            path: req.file.path
        });

        const soal = parseWord(hasil.value);

        const hasilValidasi = validateSoal(soal);

        req.session.previewSoal = hasilValidasi;

        const mapel = await bankSoalModel.getMapel();
        const guru = await bankSoalModel.getGuru();

  

res.render("bank-soal/preview-word", {
    hasilValidasi,
    mapel,
    guru
});

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// IMPORT KE DATABASE
// ======================================
exports.importDatabase = async (req, res) => {

    try {

        const soal = req.session.previewSoal;

        if (!soal || soal.length === 0) {
            return res.send("Tidak ada data untuk diimport.");
        }

        for (const item of soal) {

            await bankSoalModel.create({

                mapel_id: req.body.mapel_id,
                guru_id: req.body.guru_id,
                jenis: item.data.jenis,

                pertanyaan: item.data.pertanyaan,

                pilihan_a: item.data.pilihan_a,
                pilihan_b: item.data.pilihan_b,
                pilihan_c: item.data.pilihan_c,
                pilihan_d: item.data.pilihan_d,
                pilihan_e: item.data.pilihan_e,

                jawaban: item.data.jawaban,

                bobot: item.data.bobot,

                gambar: item.data.gambar,
                audio: item.data.audi,
                video: item.data.video,

                status: 1

            });

        }

        delete req.session.previewSoal;

        res.redirect("/bank-soal");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};