const db = require("../config/database");

// ======================================
// SEMUA HASIL UJIAN
// ======================================

exports.getSemuaHasil = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                hasil_ujian.*,

                siswa.nama,

                siswa.nisn,

                kelas.nama AS kelas,

                mapel.nama_mapel,

                ujian.nama_ujian

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

                kelas.nama,

                siswa.nama

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

// ======================================
// FILTER LAPORAN
// ======================================

exports.filterLaporan = (filter) => {

    return new Promise((resolve, reject) => {

        let sql = `
        SELECT

            hasil_ujian.*,

            siswa.nama,

            siswa.nisn,

            kelas.nama AS kelas,

            mapel.nama_mapel,

            ujian.nama_ujian

        FROM hasil_ujian

        LEFT JOIN siswa
            ON hasil_ujian.siswa_id = siswa.id

        LEFT JOIN kelas
            ON siswa.kelas_id = kelas.id

        LEFT JOIN ujian
            ON hasil_ujian.ujian_id = ujian.id

        LEFT JOIN mapel
            ON ujian.mapel_id = mapel.id

        WHERE 1=1
        `;

        const params = [];

        if(filter.kelas){

            sql += " AND kelas.id=?";

            params.push(filter.kelas);

        }

        if(filter.mapel){

            sql += " AND mapel.id=?";

            params.push(filter.mapel);

        }

        if(filter.ujian){

            sql += " AND ujian.id=?";

            params.push(filter.ujian);

        }

        sql += " ORDER BY kelas.nama, siswa.nama";

        db.all(

            sql,

            params,

            (err, rows) => {

                if(err){

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

// ======================================
// DAFTAR KELAS
// ======================================

exports.getKelas = () => {

    return new Promise((resolve, reject) => {

        db.all(

            "SELECT id, nama FROM kelas ORDER BY nama",

            [],

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows);

            }

        );

    });

};

// ======================================
// DAFTAR MAPEL
// ======================================

exports.getMapel = () => {

    return new Promise((resolve, reject) => {

        db.all(

            "SELECT id, nama_mapel FROM mapel ORDER BY nama_mapel",

            [],

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows);

            }

        );

    });

};

// ======================================
// DAFTAR UJIAN
// ======================================

exports.getUjian = () => {

    return new Promise((resolve, reject) => {

        db.all(

            "SELECT id, nama_ujian FROM ujian ORDER BY nama_ujian",

            [],

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows);

            }

        );

    });

};