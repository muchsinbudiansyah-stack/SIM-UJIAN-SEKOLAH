const bankSoalModel = require("../models/bankSoalModel");
const mammoth = require("mammoth");
const parseWord = require("../helpers/wordParser");
const validateSoal = require("../helpers/importValidator");

// ======================================
// DAFTAR MAPEL (FOLDER)
// ======================================
exports.index = async (req, res) => {

    try {

        let mapel = [];

        // ==========================
        // ADMIN
        // ==========================
        if (req.session.user.role === "admin") {

            mapel =
                await bankSoalModel.getMapel();

        }

        // ==========================
        // GURU
        // ==========================
        else {

            const guru =
                await bankSoalModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guru) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            mapel =
                await bankSoalModel.getMapelGuru(
                    guru.id
                );

        }

        res.render(

            "bank-soal/index",

            {

                mapel,

                role: req.session.user.role

            }

        );

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// DAFTAR SOAL BERDASARKAN MAPEL
// ======================================
exports.getByMapel = async (req, res) => {

    try {

        const mapelId = req.params.id;

        let soal;

        // ======================================
        // ADMIN
        // ======================================

        if (req.session.user.role === "admin") {

            soal =
                await bankSoalModel.getByMapelId(
                    mapelId
                );

        }

        // ======================================
        // GURU
        // ======================================

        else {

            const guru =
                await bankSoalModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guru) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            // Validasi bahwa mapel ini memang
            // dimiliki oleh guru login
            const boleh =
                await bankSoalModel.isGuruMengajarMapel(

                    guru.id,

                    mapelId

                );

            if (!boleh) {

                return res.send(
                    "Anda tidak memiliki akses ke mata pelajaran tersebut."
                );

            }

            soal =
                await bankSoalModel.getByGuruAndMapel(

                    guru.id,

                    mapelId

                );

        }

        // ======================================
        // AMBIL DATA MAPEL
        // ======================================

        const mapel =
            await bankSoalModel.getMapelById(
                mapelId
            );

        if (!mapel) {

            return res.send(
                "Mata pelajaran tidak ditemukan."
            );

        }

        res.render(

            "bank-soal/mapel",

            {

                soal,

                mapel,

                role: req.session.user.role,

                user: req.session.user

            }

        );

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM TAMBAH SOAL
// ======================================
exports.tambah = async (req, res) => {

    try {

        // =====================================
        // ADMIN
        // =====================================

        if (req.session.user.role === "admin") {

            const mapel =
                await bankSoalModel.getMapel();

            const guru =
                await bankSoalModel.getGuru();

            return res.render(

                "bank-soal/tambah",

                {

                    mapel,

                    guru,

                    role: "admin"

                }

            );

        }

        // =====================================
        // GURU
        // =====================================

        const guruLogin =
            await bankSoalModel.getGuruByNIP(
                req.session.user.username
            );

        if (!guruLogin) {

            return res.send(
                "Data guru tidak ditemukan."
            );

        }

        const mapel =
            await bankSoalModel.getMapelGuru(
                guruLogin.id
            );

        if (!mapel.length) {

            return res.send(
                "Guru belum memiliki mata pelajaran."
            );

        }

        res.render(

            "bank-soal/tambah",

            {

                guru: [

                    guruLogin

                ],

                mapel,

                role: "guru"

            }

        );

    }

    catch (err) {

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
        let namaAudio = "";
        let namaVideo = "";

        if (req.files) {

            if (req.files.gambar && req.files.gambar.length > 0) {
                namaGambar = req.files.gambar[0].filename;
            }

            if (req.files.audio && req.files.audio.length > 0) {
                namaAudio = req.files.audio[0].filename;
            }

            if (req.files.video && req.files.video.length > 0) {
                namaVideo = req.files.video[0].filename;
            }

        }

        let guruId = req.body.guru_id;
        let mapelId = req.body.mapel_id;

        // =====================================
        // LOGIN GURU
        // =====================================

        if (req.session.user.role === "guru") {

            const guruLogin =
                await bankSoalModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guruLogin) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            guruId = guruLogin.id;

            // VALIDASI MAPEL YANG DIPILIH
            const boleh =
                await bankSoalModel.isGuruMengajarMapel(

                    guruLogin.id,

                    mapelId

                );

            if (!boleh) {

                return res.send(
                    "Anda tidak berhak menyimpan soal pada mata pelajaran tersebut."
                );

            }

        }

        await bankSoalModel.create({

            mapel_id: mapelId,

            guru_id: guruId,

            jenis: req.body.jenis,

            pertanyaan: req.body.pertanyaan,

            pilihan_a: req.body.pilihan_a,

            pilihan_b: req.body.pilihan_b,

            pilihan_c: req.body.pilihan_c,

            pilihan_d: req.body.pilihan_d,

            pilihan_e: req.body.pilihan_e,

            jawaban:

                req.body.jenis === "BS"

                    ? req.body.jawaban_bs

                    : req.body.jawaban,

            bobot: req.body.bobot,

            gambar: namaGambar,

            audio: namaAudio,

            video: namaVideo,

            status: req.body.status

        });

        res.redirect("/bank-soal");

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM EDIT SOAL
// ======================================
exports.edit = async (req, res) => {

    try {

        const soal =
            await bankSoalModel.findById(
                req.params.id
            );

        if (!soal) {

            return res.send(
                "Soal tidak ditemukan."
            );

        }

        // =====================================
        // ADMIN
        // =====================================

        if (req.session.user.role === "admin") {

            const mapel =
                await bankSoalModel.getMapel();

            const guru =
                await bankSoalModel.getGuru();

            return res.render(

                "bank-soal/edit",

                {

                    soal,

                    mapel,

                    guru,

                    role: "admin"

                }

            );

        }

        // =====================================
        // GURU
        // =====================================

        const guruLogin =
            await bankSoalModel.getGuruByNIP(
                req.session.user.username
            );

        if (!guruLogin) {

            return res.send(
                "Data guru tidak ditemukan."
            );

        }

        // Guru hanya boleh mengedit soal miliknya
        if (Number(soal.guru_id) !== Number(guruLogin.id)) {

            return res.send(
                "Anda tidak mempunyai hak mengedit soal ini."
            );

        }

        // Pastikan mapel soal memang termasuk mapel guru
        const boleh =
            await bankSoalModel.isGuruMengajarMapel(

                guruLogin.id,

                soal.mapel_id

            );

        if (!boleh) {

            return res.send(
                "Anda tidak mempunyai akses ke mata pelajaran tersebut."
            );

        }

        const mapel =
            await bankSoalModel.getMapelGuru(
                guruLogin.id
            );

        res.render(

            "bank-soal/edit",

            {

                soal,

                mapel,

                guru: [

                    guruLogin

                ],

                role: "guru"

            }

        );

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// UPDATE SOAL
// ======================================
exports.update = async (req, res) => {

    try {

        const soalLama =
            await bankSoalModel.findById(
                req.params.id
            );

        if (!soalLama) {

            return res.send(
                "Data soal tidak ditemukan."
            );

        }

        let namaGambar = soalLama.gambar;
        let namaAudio = soalLama.audio;
        let namaVideo = soalLama.video;

        if (req.files) {

            if (req.files.gambar && req.files.gambar.length > 0) {
                namaGambar = req.files.gambar[0].filename;
            }

            if (req.files.audio && req.files.audio.length > 0) {
                namaAudio = req.files.audio[0].filename;
            }

            if (req.files.video && req.files.video.length > 0) {
                namaVideo = req.files.video[0].filename;
            }

        }

        let guruId = req.body.guru_id;
        let mapelId = req.body.mapel_id;

        // =====================================
        // LOGIN GURU
        // =====================================

        if (req.session.user.role === "guru") {

            const guruLogin =
                await bankSoalModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guruLogin) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            // Guru hanya boleh mengedit soal miliknya
            if (Number(soalLama.guru_id) !== Number(guruLogin.id)) {

                return res.send(
                    "Anda tidak memiliki akses."
                );

            }

            guruId = guruLogin.id;

            // Validasi mapel yang dipilih
            const boleh =
                await bankSoalModel.isGuruMengajarMapel(

                    guruLogin.id,

                    mapelId

                );

            if (!boleh) {

                return res.send(
                    "Anda tidak berhak memindahkan soal ke mata pelajaran tersebut."
                );

            }

        }

        await bankSoalModel.update(

            req.params.id,

            {

                mapel_id: mapelId,

                guru_id: guruId,

                jenis: req.body.jenis,

                pertanyaan: req.body.pertanyaan,

                pilihan_a: req.body.pilihan_a,

                pilihan_b: req.body.pilihan_b,

                pilihan_c: req.body.pilihan_c,

                pilihan_d: req.body.pilihan_d,

                pilihan_e: req.body.pilihan_e,

                jawaban:

                    req.body.jenis === "BS"

                        ? req.body.jawaban_bs

                        : req.body.jawaban,

                bobot: req.body.bobot,

                gambar: namaGambar,

                audio: namaAudio,

                video: namaVideo,

                status: req.body.status

            }

        );

        res.redirect("/bank-soal");

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HAPUS SOAL
// ======================================
exports.hapus = async (req, res) => {

    try {

        const soal =
            await bankSoalModel.findById(
                req.params.id
            );

        if (!soal) {

            return res.send(
                "Data soal tidak ditemukan."
            );

        }

        // =====================================
        // LOGIN GURU
        // =====================================

        if (req.session.user.role === "guru") {

            const guruLogin =
                await bankSoalModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guruLogin) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            // Guru hanya boleh menghapus soal miliknya
            if (Number(soal.guru_id) !== Number(guruLogin.id)) {

                return res.send(
                    "Anda tidak memiliki akses menghapus soal ini."
                );

            }

            // Pastikan mapel soal memang termasuk mapel guru
            const boleh =
                await bankSoalModel.isGuruMengajarMapel(

                    guruLogin.id,

                    soal.mapel_id

                );

            if (!boleh) {

                return res.send(
                    "Anda tidak memiliki akses ke mata pelajaran tersebut."
                );

            }

        }

        await bankSoalModel.delete(
            req.params.id
        );

        res.redirect("/bank-soal");

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HALAMAN IMPORT WORD
// ======================================
exports.showImportWord = async (req, res) => {

    try {

        // ============================
        // ADMIN
        // ============================

        if (req.session.user.role === "admin") {

            const mapel =
                await bankSoalModel.getMapel();

            const guru =
                await bankSoalModel.getGuru();

            return res.render(

                "bank-soal/import-word",

                {

                    role: "admin",

                    mapel,

                    guru

                }

            );

        }

        // ============================
        // GURU
        // ============================

        const guruLogin =
            await bankSoalModel.getGuruByNIP(
                req.session.user.username
            );

        if (!guruLogin) {

            return res.send(
                "Data guru tidak ditemukan."
            );

        }

        const mapel =
            await bankSoalModel.getMapelGuru(
                guruLogin.id
            );

        res.render(

            "bank-soal/import-word",

            {

                role: "guru",

                guru: [

                    guruLogin

                ],

                mapel

            }

        );

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

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

        let guru;
let mapel;

// ======================================
// ADMIN
// ======================================

if (req.session.user.role === "admin") {

    guru = await bankSoalModel.getGuru();
    mapel = await bankSoalModel.getMapel();

}

// ======================================
// GURU
// ======================================

else {

    const guruLogin =
        await bankSoalModel.getGuruByNIP(
            req.session.user.username
        );

    guru = [guruLogin];

    

    mapel =
    await bankSoalModel.getMapelGuru(
        guruLogin.id
    );

        

}

console.log("======================");
console.log("ROLE :", req.session.user.role);
console.log("GURU :", guru);
console.log("MAPEL :", mapel);
console.log("======================");
  

res.render("bank-soal/preview-word", {

    hasilValidasi,

    guru,

    mapel,

    role: req.session.user.role

});

}

catch (err) {

    console.log(err);

    res.send(err.message);

}

};

// ======================================
// IMPORT KE DATABASE
// ======================================
exports.importDatabase = async (req, res) => {

    try {

        console.log("===== IMPORT DATABASE =====");
        console.log("BODY :", req.body);
        console.log("PREVIEW :", req.session.previewSoal);

        const soal = req.session.previewSoal;

        let guruId = req.body.guru_id;
        let mapelId = req.body.mapel_id;

        console.log("=================================");
        console.log("Mapel dari Form :", mapelId);
        console.log("Guru dari Form  :", guruId);
        console.log("=================================");

        // ======================================
        // LOGIN GURU
        // ======================================

        if (req.session.user.role === "guru") {

            const guruLogin =
                await bankSoalModel.getGuruByNIP(
                    req.session.user.username
                );

            console.log("===== DATA GURU LOGIN =====");
            console.log(guruLogin);

            guruId = guruLogin.id;

            console.log("Guru ID Login :", guruId);
            console.log("Mapel ID      :", mapelId);

            const boleh =
                await bankSoalModel.isGuruMengajarMapel(
                    guruLogin.id,
                    mapelId
                );

            console.log("HASIL VALIDASI :", boleh);

            if (!boleh) {

                return res.send(
                    "Anda tidak memiliki akses ke mata pelajaran tersebut."
                );

            }

        }

        if (!soal || soal.length === 0) {
            return res.send("Tidak ada data untuk diimport.");
        }

        for (const item of soal) {

            console.log("IMPORT SOAL:");
            console.log(item.data);

            await bankSoalModel.create({

                mapel_id: mapelId,
                guru_id: guruId,

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
                audio: item.data.audio,
                video: item.data.video,

                status: 1

            });

            console.log("✓ Berhasil import 1 soal");

        }

        delete req.session.previewSoal;

        res.redirect("/bank-soal");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};