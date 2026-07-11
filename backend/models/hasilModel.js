const db = require("../config/database");

// ======================================
// SEMUA HASIL UJIAN
// ======================================

exports.getAllHasil = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                hasil_ujian.*,

                siswa.nama AS nama_siswa,

                siswa.nisn,

                ujian.nama_ujian,

                mapel.nama_mapel,

                kelas.nama AS nama_kelas

            FROM hasil_ujian

            LEFT JOIN siswa
                ON hasil_ujian.siswa_id = siswa.id

            LEFT JOIN ujian
                ON hasil_ujian.ujian_id = ujian.id

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            LEFT JOIN kelas
                ON siswa.kelas_id = kelas.id

            ORDER BY hasil_ujian.nilai DESC
            `,

            [],

            (err, rows) => {

                if (err) {

                    reject(err);

                } else {

                    resolve(rows);

                }

            }

        );

    });

};

// ======================================
// DETAIL HASIL SATU SISWA
// ======================================

exports.getDetail = (id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *

            FROM hasil_ujian

            WHERE id = ?
            `,

            [id],

            (err, row) => {

                if (err) {

                    reject(err);

                } else {

                    resolve(row);

                }

            }

        );

    });

};

// ======================================
// DETAIL JAWABAN SISWA
// ======================================

exports.getDetailJawaban = (hasil_id) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                jawaban_siswa.*,

                bank_soal.pertanyaan,

                bank_soal.pilihan_a,
bank_soal.pilihan_b,
bank_soal.pilihan_c,
bank_soal.pilihan_d,
bank_soal.pilihan_e,

bank_soal.gambar,
bank_soal.audio,
bank_soal.video,

bank_soal.jawaban AS kunci

            FROM jawaban_siswa

            LEFT JOIN bank_soal
                ON jawaban_siswa.soal_id = bank_soal.id

            LEFT JOIN hasil_ujian
                ON jawaban_siswa.ujian_id = hasil_ujian.ujian_id
                AND jawaban_siswa.siswa_id = hasil_ujian.siswa_id

            WHERE hasil_ujian.id = ?

            ORDER BY jawaban_siswa.id ASC
            `,

            [hasil_id],

            (err, rows) => {

                if(err){

                    reject(err);

                }else{

                    resolve(rows);

                }

            }

        );

    });

};