const dashboardModel = require("../models/dashboardModel");

// ======================================
// DASHBOARD ADMIN
// ======================================

exports.index = async (req, res) => {

    try {

        const statistik = await dashboardModel.getStatistik();

        const aktivitas = await dashboardModel.getAktivitasTerbaru();

        res.render("admin/dashboard", {

            admin: req.session.user,

            statistik,

            aktivitas

        });

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};