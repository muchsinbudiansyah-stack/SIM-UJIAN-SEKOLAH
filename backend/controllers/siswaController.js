const siswaModel = require("../models/siswaModel");

// ======================================
// DAFTAR SISWA
// ======================================
exports.index = async (req, res) => {

    try {

        const siswa = await siswaModel.getAll();

        res.render("siswa/index", {
            siswa
        });

    } catch (err) {

        console.log(err);

        res.send("Terjadi kesalahan.");

    }

};

// ======================================
// FORM TAMBAH SISWA
// ======================================
exports.tambah = async (req, res) => {

    try {

        const kelas = await siswaModel.getKelas();

        res.render("siswa/tambah", {
            kelas
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// SIMPAN SISWA
// ======================================
exports.simpan = async (req, res) => {

    try {

        await siswaModel.create({

            nisn: req.body.nisn,
            nama: req.body.nama,
            jenis_kelamin: req.body.jenis_kelamin,
            kelas_id: req.body.kelas_id,
            tempat_lahir: req.body.tempat_lahir,
            tanggal_lahir: req.body.tanggal_lahir,
            alamat: req.body.alamat,
            no_hp: req.body.no_hp,
            foto: ""

        });

        res.redirect("/siswa");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM EDIT SISWA
// ======================================
exports.edit = async (req, res) => {

    try {

        const siswa = await siswaModel.findById(req.params.id);

        if (!siswa) {
            return res.send("Data siswa tidak ditemukan.");
        }

        const kelas = await siswaModel.getKelas();

        res.render("siswa/edit", {
            siswa,
            kelas
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// UPDATE SISWA
// ======================================
exports.update = async (req, res) => {

    try {

        await siswaModel.update(req.params.id, {

            nisn: req.body.nisn,
            nama: req.body.nama,
            jenis_kelamin: req.body.jenis_kelamin,
            kelas_id: req.body.kelas_id,
            tempat_lahir: req.body.tempat_lahir,
            tanggal_lahir: req.body.tanggal_lahir,
            alamat: req.body.alamat,
            no_hp: req.body.no_hp

        });

        res.redirect("/siswa");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HAPUS SISWA
// ======================================
exports.hapus = async (req, res) => {

    try {

        await siswaModel.delete(req.params.id);

        res.redirect("/siswa");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};