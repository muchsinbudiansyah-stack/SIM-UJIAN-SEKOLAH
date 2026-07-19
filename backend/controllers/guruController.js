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

exports.tambah = async (req, res) => {

    try {

        const mapel =
            await guruModel.getAllMapel();

        res.render("guru/tambah", {

            mapel

        });

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

        const guru =
            await guruModel.findById(req.params.id);

        if (!guru) {

            return res.send(
                "Data guru tidak ditemukan."
            );

        }

        const mapel =
            await guruModel.getAllMapel();

        res.render("guru/edit", {

            guru,

            mapel

        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// SIMPAN DATA GURU
// ======================================

exports.simpan = async (req, res) => {

    try {

        let mapel = req.body.mapel || [];

        if (!Array.isArray(mapel)) {

            mapel = [mapel];

        }

        await guruModel.create({

            nip: req.body.nip,

            nama: req.body.nama,

            email: req.body.email,

            hp: req.body.hp,

            mapel: mapel,

            foto: ""

        });

        res.redirect("/guru");

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

        let mapel = req.body.mapel || [];

        if (!Array.isArray(mapel)) {

            mapel = [mapel];

        }

        await guruModel.update(

            req.params.id,

            {

                nip: req.body.nip,

                nama: req.body.nama,

                email: req.body.email,

                hp: req.body.hp,

                mapel: mapel

            }

        );

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

// ======================================
// DETAIL GURU
// ======================================

exports.detail = async (req, res) => {

    try {

        const guru =
            await guruModel.getGuruWithMapel(
                req.params.id
            );

        if (!guru) {

            return res.send(
                "Data guru tidak ditemukan."
            );

        }

        res.render(

            "guru/detail",

            {

                guru

            }

        );

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// PILIHAN MAPEL GURU LOGIN
// (Dipakai Bank Soal, Ujian,
// Dashboard, dll.)
// ======================================

exports.getMapelGuruLogin = async (req, res) => {

    try {

        const guru =
            await guruModel.getGuruLogin(
                req.session.user.username
            );

        if (!guru) {

            return res.json([]);

        }

        res.json(guru.mapel_list);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};