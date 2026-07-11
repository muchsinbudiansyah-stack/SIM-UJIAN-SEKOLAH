const db = require("../config/database");

// ======================================
// RANKING NILAI
// ======================================

exports.getRanking = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                hasil_ujian.id,
                hasil_ujian.nilai,
                hasil_ujian.benar,
                hasil_ujian.salah,
                hasil_ujian.kosong,
                hasil_ujian.waktu_selesai,

                siswa.nama,
                siswa.nisn,

                kelas.nama AS kelas,

                ujian.nama_ujian,

                mapel.nama_mapel

            FROM hasil_ujian

            LEFT JOIN siswa
                ON hasil_ujian.siswa_id = siswa.id

            LEFT JOIN kelas
                ON siswa.kelas_id = kelas.id

            LEFT JOIN ujian
                ON hasil_ujian.ujian_id = ujian.id

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            ORDER BY

                hasil_ujian.nilai DESC,
                hasil_ujian.benar DESC,
                hasil_ujian.waktu_selesai ASC

            `,

            [],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};