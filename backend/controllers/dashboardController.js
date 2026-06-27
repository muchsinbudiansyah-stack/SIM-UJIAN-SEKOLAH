const guruModel = require("../models/guruModel");

exports.index = async (req, res) => {

    try {

        // Hitung jumlah guru
        const totalGuru = await guruModel.count();

        // Data dashboard
        res.render("admin/dashboard", {

            totalGuru: totalGuru,
            totalSiswa: 0,
            totalKelas: 0,
            totalSoal: 0

        });

    } catch (err) {

        console.log(err);

        res.send("Terjadi kesalahan pada Dashboard.");

    }

};