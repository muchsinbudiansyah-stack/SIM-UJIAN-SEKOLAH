const butirModel = require("../models/butirModel");

// ======================================
// HALAMAN ANALISIS BUTIR SOAL
// ======================================

exports.index = async (req, res) => {

    try {

        // Ambil ujian pertama jika belum dipilih
        let ujian_id = req.query.ujian;

        if (!ujian_id) {

            return res.send(
                "Silakan pilih ujian terlebih dahulu."
            );

        }

        const data = await butirModel.getAnalisisButir(
            ujian_id
        );

        // ===============================
        // RINGKASAN
        // ===============================

        let mudah = 0;
        let sedang = 0;
        let sulit = 0;

        data.forEach(item => {

            if (item.kategori === "Mudah") {

                mudah++;

            } else if (item.kategori === "Sedang") {

                sedang++;

            } else {

                sulit++;

            }

        });

        res.render(

            "admin/butir/index",

            {

                user: req.session.user,

                data,

                ujian_id,

                summary: {

                    total: data.length,

                    mudah,

                    sedang,

                    sulit

                }

            }

        );

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};