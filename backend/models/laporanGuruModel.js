const db = require("../config/database");

// ======================================
// DAFTAR UJIAN MILIK GURU
// ======================================

exports.getUjianGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT
                ujian.id,
                ujian.nama_ujian,
                mapel.nama_mapel
            FROM ujian

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            WHERE ujian.guru_id = ?

            ORDER BY
                mapel.nama_mapel,
                ujian.nama_ujian
            `,

            [guruId],

            (err, rows) => {

                if (err) reject(err);
                else resolve(rows);

            }

        );

    });

};

// ======================================
// HASIL UJIAN
// ======================================

exports.getHasilByUjian = (ujianId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                hasil_ujian.*,

                siswa.nama,
                siswa.nisn,

                kelas.nama AS kelas

            FROM hasil_ujian

            LEFT JOIN siswa
                ON hasil_ujian.siswa_id=siswa.id

            LEFT JOIN kelas
                ON siswa.kelas_id=kelas.id

            WHERE hasil_ujian.ujian_id=?

            ORDER BY hasil_ujian.nilai DESC
            `,

            [ujianId],

            (err, rows)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(rows);

                }

            }

        );

    });

};

// ======================================
// DETAIL UJIAN
// ======================================

exports.getUjianById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT
                ujian.*,
                mapel.nama_mapel,
                guru.nama AS nama_guru
            FROM ujian

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            LEFT JOIN guru
                ON ujian.guru_id = guru.id

            WHERE ujian.id = ?
            `,

            [id],

            (err, row) => {

                if(err){

                    reject(err);

                }else{

                    resolve(row);

                }

            }

        );

    });

};

// ======================================
// RANKING NILAI
// ======================================

exports.getRankingByUjian = (ujianId)=>{

    return new Promise((resolve,reject)=>{

        db.all(

            `
            SELECT

                hasil_ujian.*,

                siswa.nama,

                siswa.nisn,

                kelas.nama AS kelas

            FROM hasil_ujian

            LEFT JOIN siswa
                ON hasil_ujian.siswa_id=siswa.id

            LEFT JOIN kelas
                ON siswa.kelas_id=kelas.id

            WHERE hasil_ujian.ujian_id=?

            ORDER BY

                hasil_ujian.nilai DESC,

                hasil_ujian.benar DESC,

                hasil_ujian.salah ASC

            `,

            [ujianId],

            (err,rows)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(rows);

                }

            }

        );

    });

};

// ======================================
// DETAIL UJIAN UNTUK RANKING
// ======================================

exports.getRankingHeader = (ujianId)=>{

    return new Promise((resolve,reject)=>{

        db.get(

            `
            SELECT

                ujian.*,

                mapel.nama_mapel,

                guru.nama AS nama_guru

            FROM ujian

            LEFT JOIN mapel
                ON ujian.mapel_id=mapel.id

            LEFT JOIN guru
                ON ujian.guru_id=guru.id

            WHERE ujian.id=?
            `,

            [ujianId],

            (err,row)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(row);

                }

            }

        );

    });

};