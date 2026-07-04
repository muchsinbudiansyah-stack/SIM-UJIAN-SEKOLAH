const bankSoalModel = require("../models/bankSoalModel");
const mammoth = require("mammoth");
const parseWord = require("../helpers/wordParser");
const validateSoal = require("../helpers/importValidator");

// ======================================
// DAFTAR MAPEL (FOLDER)
// ======================================
exports.index = async (req, res) => {
    try {
        const mapel = await bankSoalModel.getMapel();
        res.render("bank-soal/index", {
            mapel: mapel
        });
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};

// ======================================
// DAFTAR SOAL PER MAPEL (ISI FOLDER)
// ======================================
exports.getByMapel = async (req, res) => {
    try {
        const mapelId = req.params.id;
        const soal = await bankSoalModel.getByMapelId(mapelId);
        
        // Kita juga perlu tahu nama mapelnya untuk judul halaman
        const daftarMapel = await bankSoalModel.getMapel();
        const mapelTerpilih = daftarMapel.find(m => m.id == mapelId);

        res.render("bank-soal/mapel", {
            soal,
            mapel: mapelTerpilih
        });
    } catch (err) {
        console.log(err);
        res.send(err.message);
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

        let namaGambar = "";

        // Jika guru meng-upload gambar
        if (req.file) {

            namaGambar = req.file.filename;

        }

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

            // Untuk Benar/Salah gunakan jawaban_bs jika dipilih
            jawaban:
                req.body.jenis === "BS"
                    ? req.body.jawaban_bs
                    : req.body.jawaban,

            bobot: req.body.bobot,

            gambar: namaGambar,

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
const fs = require('fs');
const path = require('path');

exports.update = async (req, res) => {
    try {
        // 1. Ambil data lama
        const soalLama = await bankSoalModel.findById(req.params.id);

        if (!soalLama) {
            return res.send("Data soal tidak ditemukan.");
        }

        // 2. Gunakan gambar lama secara default jika tidak ada upload baru
        let namaGambar = soalLama.gambar;

        // 3. Jika guru mengunggah gambar baru
        if (req.file) {
            namaGambar = req.file.filename;

            // Fitur Tambahan: Hapus file gambar lama dari server agar penyimpanan tidak cepat penuh
            if (soalLama.gambar) {
                // Sesuaikan path ini dengan struktur folder public/uploads Anda
                const pathGambarLama = path.join(__dirname, '../../public/uploads/gambar/soal', soalLama.gambar);
                
                // Cek apakah file lama benar-benar ada di folder sebelum dihapus
                if (fs.existsSync(pathGambarLama)) {
                    fs.unlinkSync(pathGambarLama);
                }
            }
        }

        // 4. Update data ke database
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
            jawaban: req.body.jenis === "BS" ? req.body.jawaban_bs : req.body.jawaban,
            bobot: req.body.bobot,
            gambar: namaGambar,
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