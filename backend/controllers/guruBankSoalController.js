const bankSoalModel = require("../models/bankSoalModel");
const db = require("../config/database");

exports.index = (req, res) => {

    db.get(

        "SELECT id FROM guru WHERE nip = ?",

        [req.session.user.username],

        async (err, guru) => {

            if (err) {
                return res.send(err.message);
            }

            if (!guru) {
                return res.send("Data guru tidak ditemukan.");
            }

            const soal = await bankSoalModel.getByGuru(guru.id);

            res.render("guru/bank-soal/index", {
                soal
            });

        }

    );

};

// ======================================
// FORM TAMBAH SOAL
// ======================================

exports.tambah = (req, res) => {

    db.get(

        "SELECT id FROM guru WHERE nip = ?",

        [req.session.user.username],

        async (err, guru) => {

            if (err) {

                return res.send(err.message);

            }

            if (!guru) {

                return res.send("Guru tidak ditemukan.");

            }

            const mapel = await bankSoalModel.getMapelGuru(guru.id);

            res.render("guru/bank-soal/tambah", {

                mapel

            });

        }

    );

};

// ======================================
// SIMPAN
// ======================================

exports.simpan = (req, res) => {

    res.send("Fungsi simpan belum dibuat.");

};

// ======================================
// EDIT
// ======================================

exports.edit = (req, res) => {

    res.send("Fungsi edit belum dibuat.");

};

// ======================================
// UPDATE
// ======================================

exports.update = (req, res) => {

    res.send("Fungsi update belum dibuat.");

};

// ======================================
// HAPUS
// ======================================

exports.hapus = (req, res) => {

    res.send("Fungsi hapus belum dibuat.");

};