const kelasModel = require("../models/kelasModel");

// ======================================
// TAMPILKAN SEMUA DATA KELAS
// ======================================
exports.index = async (req, res) => {

    try {

        const kelas = await kelasModel.getAll();

        res.render("kelas/index", {
            kelas
        });

    } catch (err) {

        console.log(err);

        res.send("Terjadi kesalahan.");

    }

};

// ======================================
// FORM TAMBAH KELAS
// ======================================
exports.tambah = (req, res) => {

    res.render("kelas/tambah");

};

// ======================================
// SIMPAN DATA KELAS
// ======================================
exports.simpan = async (req, res) => {

    try {

        await kelasModel.create({

            nama: req.body.nama,
            tingkat: req.body.tingkat,
            jurusan: req.body.jurusan,
            wali_kelas: req.body.wali_kelas

        });

        res.redirect("/kelas");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM EDIT KELAS
// ======================================
exports.edit = async (req, res) => {

    try {

        const kelas = await kelasModel.findById(req.params.id);

        if (!kelas) {
            return res.send("Data kelas tidak ditemukan.");
        }

        res.render("kelas/edit", {
            kelas
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// UPDATE DATA KELAS
// ======================================
exports.update = async (req, res) => {

    try {

        await kelasModel.update(req.params.id, {

            nama: req.body.nama,
            tingkat: req.body.tingkat,
            jurusan: req.body.jurusan,
            wali_kelas: req.body.wali_kelas

        });

        res.redirect("/kelas");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HAPUS DATA KELAS
// ======================================
exports.hapus = async (req, res) => {

    try {

        await kelasModel.delete(req.params.id);

        res.redirect("/kelas");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};