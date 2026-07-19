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
// DETAIL HASIL UJIAN
// ======================================

exports.getDetail = (id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT

                hasil_ujian.*,

                siswa.nama AS nama_siswa,

                siswa.nisn,

                siswa.kelas_id,

                kelas.nama AS nama_kelas,

                ujian.nama_ujian,

                ujian.mapel_id,

                ujian.guru_id,

                ujian.tanggal,

                ujian.jam_mulai,

                ujian.durasi,

                mapel.nama_mapel,

                guru.nama AS nama_guru

            FROM hasil_ujian

            INNER JOIN siswa
                ON hasil_ujian.siswa_id = siswa.id

            INNER JOIN ujian
                ON hasil_ujian.ujian_id = ujian.id

            INNER JOIN mapel
                ON ujian.mapel_id = mapel.id

            LEFT JOIN guru
                ON ujian.guru_id = guru.id

            LEFT JOIN kelas
                ON siswa.kelas_id = kelas.id

            WHERE

                hasil_ujian.id = ?

            `,

            [

                id

            ],

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

exports.getDetailJawaban = (hasilId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                jawaban_siswa.id,

                jawaban_siswa.soal_id,

                jawaban_siswa.jawaban,

                bank_soal.pertanyaan,

                bank_soal.pilihan_a,

                bank_soal.pilihan_b,

                bank_soal.pilihan_c,

                bank_soal.pilihan_d,

                bank_soal.pilihan_e,

                bank_soal.gambar,

                bank_soal.audio,

                bank_soal.video,

                bank_soal.jawaban AS kunci,

                CASE

                    WHEN jawaban_siswa.jawaban = bank_soal.jawaban

                    THEN 1

                    ELSE 0

                END AS benar

            FROM hasil_ujian

            INNER JOIN jawaban_siswa

                ON hasil_ujian.ujian_id = jawaban_siswa.ujian_id

                AND hasil_ujian.siswa_id = jawaban_siswa.siswa_id

            INNER JOIN ujian

                ON hasil_ujian.ujian_id = ujian.id

            INNER JOIN bank_soal

                ON jawaban_siswa.soal_id = bank_soal.id

                AND bank_soal.mapel_id = ujian.mapel_id

            WHERE

                hasil_ujian.id = ?

            ORDER BY

                jawaban_siswa.id ASC

            `,

            [

                hasilId

            ],

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
// HASIL BERDASARKAN MAPEL GURU
// ======================================

exports.getHasilByMapel = (daftarMapel) => {

    return new Promise((resolve, reject) => {

        if (!daftarMapel.length) {
            return resolve([]);
        }

        const placeholder = daftarMapel.map(() => "?").join(",");

        const sql = `
            SELECT
                hasil_ujian.*,
                siswa.nama AS nama_siswa,
                siswa.nisn,
                ujian.nama_ujian,
                mapel.nama_mapel,
                kelas.nama AS nama_kelas
            FROM hasil_ujian
            INNER JOIN ujian
                ON hasil_ujian.ujian_id = ujian.id
            INNER JOIN mapel
                ON ujian.mapel_id = mapel.id
            INNER JOIN siswa
                ON hasil_ujian.siswa_id = siswa.id
            LEFT JOIN kelas
                ON siswa.kelas_id = kelas.id
            WHERE ujian.mapel_id IN (${placeholder})
            ORDER BY hasil_ujian.nilai DESC
        `;

        console.log("========== QUERY HASIL ==========");
        console.log(sql);
        console.log("PARAMETER :", daftarMapel);

        db.all(sql, daftarMapel, (err, rows) => {

            if (err) {
                reject(err);
            } else {
                console.log("JUMLAH DATA :", rows.length);
                console.table(rows);
                resolve(rows);
            }

        });

    });

};

// ======================================
// CARI GURU BERDASARKAN NIP LOGIN
// ======================================

exports.getGuruByNIP = (nip) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *
            FROM guru
            WHERE nip = ?
            `,

            [nip],

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
// MAPEL YANG DIAJAR GURU
// ======================================

exports.getMapelGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                mapel.id,

                mapel.nama_mapel

            FROM guru_mapel

            INNER JOIN mapel

                ON guru_mapel.mapel_id = mapel.id

            WHERE

                guru_mapel.guru_id = ?

            ORDER BY

                mapel.nama_mapel ASC
            `,

            [

                guruId

            ],

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