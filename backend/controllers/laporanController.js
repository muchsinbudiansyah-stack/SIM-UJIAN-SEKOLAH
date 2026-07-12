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

        let data;

        if (

            filter.kelas ||

            filter.mapel ||

            filter.ujian

        ) {

            data = await laporanModel.filterLaporan(filter);

        } else {

            data = await laporanModel.getSemuaHasil();

        }

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