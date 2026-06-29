const mapelModel = require("../models/mapelModel");

// ======================================
// TAMPILKAN DATA MAPEL
// ======================================
exports.index = async (req, res) => {

    try {

        const mapel = await mapelModel.getAll();

        res.render("mapel/index", {
            mapel
        });

    } catch (err) {

        console.log(err);

        res.send("Terjadi kesalahan.");

    }

};

// ======================================
// FORM TAMBAH MAPEL
// ======================================
exports.tambah = (req, res) => {

    res.render("mapel/tambah");

};

// ======================================
// SIMPAN MAPEL
// ======================================
exports.simpan = async (req, res) => {

    try {

        await mapelModel.create({

            kode_mapel: req.body.kode_mapel,
            nama_mapel: req.body.nama_mapel,
            kkm: req.body.kkm,
            status: req.body.status

        });

        res.redirect("/mapel");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM EDIT MAPEL
// ======================================
exports.edit = async (req, res) => {

    try {

        const mapel = await mapelModel.findById(req.params.id);

        if (!mapel) {
            return res.send("Data mata pelajaran tidak ditemukan.");
        }

        res.render("mapel/edit", {
            mapel
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// UPDATE MAPEL
// ======================================
exports.update = async (req, res) => {

    try {

        await mapelModel.update(req.params.id, {

            kode_mapel: req.body.kode_mapel,
            nama_mapel: req.body.nama_mapel,
            kkm: req.body.kkm,
            status: req.body.status

        });

        res.redirect("/mapel");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HAPUS MAPEL
// ======================================
exports.hapus = async (req, res) => {

    try {

        await mapelModel.delete(req.params.id);

        res.redirect("/mapel");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};