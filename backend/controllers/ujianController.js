const ujianModel = require("../models/ujianModel");

// ======================================
// DAFTAR UJIAN
// ======================================
exports.index = async (req, res) => {

    try {

        const ujian = await ujianModel.getAll();

        res.render("ujian/index", {
            ujian
        });

    } catch (err) {

        console.log(err);

        res.send("Terjadi kesalahan.");

    }

};

// ======================================
// FORM TAMBAH UJIAN
// ======================================
exports.tambah = async (req, res) => {

    try {

        const mapel = await ujianModel.getMapel();
        const kelas = await ujianModel.getKelas();
        const guru = await ujianModel.getGuru();

        res.render("ujian/tambah", {
            mapel,
            kelas,
            guru
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// SIMPAN UJIAN
// ======================================
exports.simpan = async (req, res) => {

    try {

        await ujianModel.create({

            nama_ujian: req.body.nama_ujian,
            mapel_id: req.body.mapel_id,
            kelas_id: req.body.kelas_id,
            guru_id: req.body.guru_id,
            tanggal: req.body.tanggal,
            jam_mulai: req.body.jam_mulai,
            jam_selesai: req.body.jam_selesai,
            durasi: req.body.durasi,
            jumlah_soal: req.body.jumlah_soal,
            acak_soal: req.body.acak_soal ? 1 : 0,
            acak_jawaban: req.body.acak_jawaban ? 1 : 0,
            token: req.body.token,
            status: 1

        });

        res.redirect("/ujian");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM EDIT UJIAN
// ======================================
exports.edit = async (req, res) => {

    try {

        const ujian = await ujianModel.findById(req.params.id);

        if (!ujian) {
            return res.send("Data ujian tidak ditemukan.");
        }

        const mapel = await ujianModel.getMapel();
        const kelas = await ujianModel.getKelas();
        const guru = await ujianModel.getGuru();

        res.render("ujian/edit", {
            ujian,
            mapel,
            kelas,
            guru
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// UPDATE UJIAN
// ======================================
exports.update = async (req, res) => {

    try {

        await ujianModel.update(req.params.id, {

            nama_ujian: req.body.nama_ujian,
            mapel_id: req.body.mapel_id,
            kelas_id: req.body.kelas_id,
            guru_id: req.body.guru_id,
            tanggal: req.body.tanggal,
            jam_mulai: req.body.jam_mulai,
            jam_selesai: req.body.jam_selesai,
            durasi: req.body.durasi,
            jumlah_soal: req.body.jumlah_soal,
            acak_soal: req.body.acak_soal ? 1 : 0,
            acak_jawaban: req.body.acak_jawaban ? 1 : 0,
            token: req.body.token,
            status: req.body.status ? 1 : 0

        });

        res.redirect("/ujian");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HAPUS UJIAN
// ======================================
exports.hapus = async (req, res) => {

    try {

        await ujianModel.delete(req.params.id);

        res.redirect("/ujian");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};