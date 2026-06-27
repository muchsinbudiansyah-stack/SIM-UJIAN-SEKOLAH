const guruModel = require("../models/guruModel");

// ======================================
// TAMPILKAN SEMUA DATA GURU
// ======================================
exports.index = async (req, res) => {

    try {

        const guru = await guruModel.getAll();

        res.render("guru/index", {
            guru
        });

    } catch (err) {

        console.log(err);

        res.send("Terjadi kesalahan.");

    }

};

// ======================================
// FORM TAMBAH GURU
// ======================================
exports.tambah = (req, res) => {

    res.render("guru/tambah");

};

// ======================================
// SIMPAN DATA GURU
// ======================================
exports.simpan = async (req, res) => {

    try {

        await guruModel.create({

            nip: req.body.nip,
            nama: req.body.nama,
            email: req.body.email,
            hp: req.body.hp,
            mapel: req.body.mapel,
            foto: ""

        });

        res.redirect("/guru");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM EDIT GURU
// ======================================
exports.edit = async (req, res) => {

    try {

        const guru = await guruModel.findById(req.params.id);

        if (!guru) {
            return res.send("Data guru tidak ditemukan.");
        }

        res.render("guru/edit", {
            guru
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// UPDATE DATA GURU
// ======================================
exports.update = async (req, res) => {

    try {

        await guruModel.update(req.params.id, {

            nip: req.body.nip,
            nama: req.body.nama,
            email: req.body.email,
            hp: req.body.hp,
            mapel: req.body.mapel

        });

        res.redirect("/guru");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HAPUS DATA GURU
// ======================================
exports.hapus = async (req, res) => {

    try {

        await guruModel.delete(req.params.id);

        res.redirect("/guru");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};