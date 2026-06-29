const guruModel = require("../models/guruModel");
const kelasModel = require("../models/kelasModel");
const mapelModel = require("../models/mapelModel");

exports.index = async (req, res) => {

    try {

        // ======================================
        // HITUNG DATA DASHBOARD
        // ======================================

        const totalGuru = await guruModel.count();

        const totalKelas = await kelasModel.count();

        const totalMapel = await mapelModel.count();

        // ======================================
        // TAMPILKAN DASHBOARD
        // ======================================

        res.render("admin/dashboard", {

            totalGuru,
            totalKelas,
            totalMapel,

            // sementara
            totalSiswa: 0,
            totalSoal: 0

        });

    } catch (err) {

        console.log(err);

        res.send("Terjadi kesalahan pada Dashboard.");

    }

};