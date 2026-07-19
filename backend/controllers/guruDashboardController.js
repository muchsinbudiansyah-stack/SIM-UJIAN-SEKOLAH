const dashboardModel = require("../models/dashboardModel");
const bankSoalModel = require("../models/bankSoalModel");

// ======================================
// DASHBOARD GURU
// ======================================

exports.index = async (req, res) => {

    try {

        // Cari data guru berdasarkan NIP login
        const guru = await bankSoalModel.getGuruByNIP(
            req.session.user.username
        );

        if (!guru) {

            return res.send("Data guru tidak ditemukan.");

        }

        // Statistik guru
        const statistik = await dashboardModel.getStatistikGuru(
            guru.id
        );

        // Aktivitas terbaru
        const aktivitas =
            await dashboardModel.getAktivitasGuru(
                guru.id
            );

        res.render("guru/dashboard/index", {

            user: req.session.user,

            guru,

            statistik,

            aktivitas

        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};