const hasilModel = require("../models/hasilModel");

// ======================================
// DAFTAR HASIL UJIAN
// ======================================

exports.index = async (req, res) => {

    try {

        console.log("\n======================================");
        console.log("===== MASUK HASIL CONTROLLER =====");
        console.log("ROLE :", req.session.user.role);
        console.log("SESSION :", req.session.user);
        console.log("======================================");

        let hasil = [];

        if (req.session.user.role === "admin") {

            hasil = await hasilModel.getAllHasil();

            console.log("LOGIN SEBAGAI ADMIN");
            console.log("JUMLAH HASIL :", hasil.length);

        } else {

            // ======================================
            // AMBIL DATA GURU LOGIN
            // ======================================

            const guru = await hasilModel.getGuruByNIP(
                req.session.user.username
            );

            console.log("DATA GURU LOGIN");
            console.log(guru);

            if (!guru) {

                return res.send("Data guru tidak ditemukan.");

            }

            // ======================================
            // AMBIL MAPEL GURU
            // ======================================

            const mapelGuru =
                await hasilModel.getMapelGuru(
                    guru.id
                );

            console.log("MAPEL GURU");
            console.table(mapelGuru);

            if (mapelGuru.length === 0) {

                console.log("GURU TIDAK MEMILIKI MAPEL");

                return res.render(
                    "admin/hasil/index",
                    {
                        hasil: [],
                        role: req.session.user.role
                    }
                );

            }

            // ======================================
            // DAFTAR ID MAPEL
            // ======================================

            const daftarMapel =
                mapelGuru.map(m => m.id);

            console.log("DAFTAR MAPEL");
            console.log(daftarMapel);

            // ======================================
            // AMBIL HASIL
            // ======================================

            hasil =
                await hasilModel.getHasilByMapel(
                    daftarMapel
                );

            console.log("JUMLAH HASIL :", hasil.length);

            console.table(
                hasil.map(item => ({
                    id: item.id,
                    ujian: item.nama_ujian,
                    mapel: item.nama_mapel,
                    siswa: item.nama_siswa,
                    nilai: item.nilai
                }))
            );

        }

        console.log("RENDER VIEW");
        console.log("TOTAL DATA :", hasil.length);

        res.render(
            "admin/hasil/index",
            {
                hasil,
                role: req.session.user.role
            }
        );

    }

    catch (err) {

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

        const jawaban =
            await hasilModel.getDetailJawaban(
                req.params.id
            );

        res.render(
            "admin/hasil/detail",
            {
                hasil,
                jawaban
            }
        );

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};