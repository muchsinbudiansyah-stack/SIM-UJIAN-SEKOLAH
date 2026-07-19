const analisisModel = require("../models/analisisModel");
const hasilModel = require("../models/hasilModel");
const laporanGuruModel = require("../models/laporanGuruModel");
const butirModel = require("../models/butirModel");

exports.index = async (req, res) => {

    try {

        const guru = await hasilModel.getGuruByNIP(
            req.session.user.username
        );

        const daftarUjian = await laporanGuruModel.getUjianGuru(
            guru.id
        );

        let statistik = null;

        if (req.query.ujian) {

            statistik =
                await analisisModel.getStatistikUjian(
                    req.query.ujian
                );

            const dataNilai =
                await analisisModel.getNilaiByUjian(
                    req.query.ujian
                );

            const nilai =
                dataNilai
                    .map(item => Number(item.nilai))
                    .sort((a, b) => a - b);

            // ============================
            // Median
            // ============================

            let median = 0;

            if (nilai.length > 0) {

                const tengah =
                    Math.floor(nilai.length / 2);

                if (nilai.length % 2 === 0) {

                    median =
                        (
                            nilai[tengah - 1] +
                            nilai[tengah]
                        ) / 2;

                } else {

                    median = nilai[tengah];

                }

            }

            // ============================
            // Standar Deviasi
            // ============================

            let standarDeviasi = 0;

            if (nilai.length > 0) {

                const rata =
                    nilai.reduce((a, b) => a + b, 0) /
                    nilai.length;

                const varians =
                    nilai.reduce((a, b) => {

                        return a + Math.pow(b - rata, 2);

                    }, 0) / nilai.length;

                standarDeviasi =
                    Number(Math.sqrt(varians)).toFixed(2);

            }

            statistik.median = median;
            statistik.standarDeviasi = standarDeviasi;
            statistik.kkm = 75;

            // ============================
            // Kelulusan
            // ============================

            const kelulusan =
                await analisisModel.getKelulusanByUjian(
                    req.query.ujian,
                    75
                );

            statistik.lulus =
                kelulusan.lulus || 0;

            statistik.tidakLulus =
                kelulusan.tidakLulus || 0;

            // ============================
            // Distribusi Nilai
            // ============================

            const distribusiData =
                await analisisModel.getDistribusiNilai(
                    req.query.ujian
                );

            const bucket = Array(10).fill(0);

            distribusiData.forEach(item => {

                let index =
                    Math.floor(Number(item.nilai) / 10);

                if (index > 9) index = 9;
                if (index < 0) index = 0;

                bucket[index]++;

            });

            statistik.distribusi = bucket;

            // ============================
            // Analisis Butir
            // ============================

            const analisisButir =
                await butirModel.getAnalisisButir(
                    req.query.ujian
                );

            statistik.butir = analisisButir;

            // ============================
            // Top 5 Soal Tersulit
            // ============================

            statistik.soalSulit =
                [...analisisButir]
                    .sort((a, b) => Number(a.persentase) - Number(b.persentase))
                    .slice(0, 5);

            // ============================
            // Top 5 Soal Termudah
            // ============================

            statistik.soalMudah =
                [...analisisButir]
                    .sort((a, b) => Number(b.persentase) - Number(a.persentase))
                    .slice(0, 5);

        }

        res.render(
            "guru/analisis/index",
            {
                user: req.session.user,
                daftarUjian,
                statistik,
                ujianDipilih: req.query.ujian || ""
            }
        );

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};