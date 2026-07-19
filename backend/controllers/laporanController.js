const laporanModel = require("../models/laporanModel");

// ======================================
// HALAMAN LAPORAN
// ======================================

exports.index = async (req, res) => {

    try {

        const filter = {

            kelas: req.query.kelas || "",

            mapel: req.query.mapel || "",

            ujian: req.query.ujian || ""

        };

        const data = await laporanModel.getHasilFilter(filter);

        const daftarKelas = await laporanModel.getKelas();

const daftarMapel = await laporanModel.getMapel();

const daftarUjian = await laporanModel.getUjian();

        res.render(

            "admin/laporan/index",

            {

                user: req.session.user,

        data,

        filter,

        daftarKelas,

        daftarMapel,

        daftarUjian

            }

        );

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};
