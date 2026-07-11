const hasilModel = require("../models/hasilModel");

// ======================================
// DAFTAR HASIL UJIAN
// ======================================

exports.index = async (req, res) => {

    try {

        const hasil = await hasilModel.getAllHasil();

        console.log("========== HASIL UJIAN ==========");
        console.table(hasil);
        console.log("=================================");

        res.render("admin/hasil/index", {
            hasil
        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// DETAIL HASIL
// ======================================

exports.detail = async (req, res) => {

    try {

        const detail = await hasilModel.getDetail(

            req.params.id

        );

        res.render(

            "admin/hasil/detail",

            {

                detail

            }

        );

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// DETAIL HASIL UJIAN
// ======================================

exports.detail = async (req, res) => {

    try {

        const hasil = await hasilModel.getDetail(
            req.params.id
        );

        if (!hasil) {

            return res.send("Data hasil tidak ditemukan.");

        }

        const jawaban = await hasilModel.getDetailJawaban(
            req.params.id
        );

        res.render(
            "admin/hasil/detail",
            {
                hasil,
                jawaban
            }
        );

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};