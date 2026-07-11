const monitorModel = require("../models/monitorModel");

// ======================================
// HALAMAN MONITORING
// ======================================

exports.index = async (req, res) => {

    try {

        const data = await monitorModel.getMonitoring();

        const summary = await monitorModel.getSummary();

        res.render("admin/monitor/index", {

            user: req.session.user,

            data,

            summary

        });

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

// ======================================
// API REALTIME
// ======================================

exports.realtime = async (req, res) => {

    try {

        const data = await monitorModel.getRealtime();

        const summary = await monitorModel.getSummary();

        res.json({

            success: true,

            summary,

            data

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};