const db = require("../config/database");

// ======================================
// TAMPILKAN SEMUA SOAL
// ======================================
exports.getAll = () => {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT
                bank_soal.*,
                mapel.nama_mapel,
                guru.nama
            FROM bank_soal
            LEFT JOIN mapel
                ON bank_soal.mapel_id = mapel.id
            LEFT JOIN guru
                ON bank_soal.guru_id = guru.id
            ORDER BY bank_soal.id DESC
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
// SOAL BERDASARKAN GURU
// ======================================
exports.getByGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT
                bank_soal.*,
                mapel.nama_mapel,
                guru.nama
            FROM bank_soal
            LEFT JOIN mapel
                ON bank_soal.mapel_id = mapel.id
            LEFT JOIN guru
                ON bank_soal.guru_id = guru.id
            WHERE bank_soal.guru_id = ?
            ORDER BY bank_soal.id DESC
            `,

            [guruId],

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

// ======================================
// TAMPILKAN SOAL BERDASARKAN ID MAPEL
// ======================================
exports.getByMapelId = (mapelId) => {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT
                bank_soal.*,
                mapel.nama_mapel,
                guru.nama
            FROM bank_soal
            LEFT JOIN mapel
                ON bank_soal.mapel_id = mapel.id
            LEFT JOIN guru
                ON bank_soal.guru_id = guru.id
            WHERE bank_soal.mapel_id = ?
            ORDER BY bank_soal.id DESC
            `,
            [mapelId],
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
// SOAL BERDASARKAN GURU DAN MAPEL
// ======================================
exports.getByGuruAndMapel = (guruId, mapelId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT
                bank_soal.*,
                mapel.nama_mapel,
                guru.nama
            FROM bank_soal
            LEFT JOIN mapel
                ON bank_soal.mapel_id = mapel.id
            LEFT JOIN guru
                ON bank_soal.guru_id = guru.id
            WHERE
                bank_soal.guru_id = ?
            AND
                bank_soal.mapel_id = ?
            ORDER BY bank_soal.id DESC
            `,

            [
                guruId,
                mapelId
            ],

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

// ======================================
// HITUNG JUMLAH SOAL
// ======================================
exports.count = () => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT COUNT(*) AS total FROM bank_soal",
            [],
            (err, row) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(row.total);
                }

            }

        );

    });

};

// ======================================
// AMBIL DATA MAPEL
// ======================================
exports.getMapel = () => {

    return new Promise((resolve, reject) => {

        db.all(
            "SELECT * FROM mapel ORDER BY nama_mapel ASC",
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
// AMBIL MAPEL YANG DIAJAR GURU
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

            WHERE guru_mapel.guru_id = ?

            ORDER BY mapel.nama_mapel ASC
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

// ======================================
// CEK APAKAH GURU MENGAJAR MAPEL
// ======================================

exports.isGuruMengajarMapel = (guruId, mapelId) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT id

            FROM guru_mapel

            WHERE guru_id = ?
            AND mapel_id = ?
            `,

            [

                guruId,

                mapelId

            ],

            (err, row) => {

                if (err) {

                    reject(err);

                } else {

                    resolve(!!row);

                }

            }

        );

    });

};

// ======================================
// AMBIL SATU DATA MAPEL
// ======================================

exports.getMapelById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *

            FROM mapel

            WHERE id = ?
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
// AMBIL DATA GURU
// ======================================
exports.getGuru = () => {

    return new Promise((resolve, reject) => {

        db.all(
            "SELECT * FROM guru ORDER BY nama ASC",
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
// AMBIL GURU BERDASARKAN NIP
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
// SIMPAN SOAL
// ======================================
exports.create = (data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `
            INSERT INTO bank_soal
            (
                mapel_id,
                guru_id,
                jenis,
                pertanyaan,
                pilihan_a,
                pilihan_b,
                pilihan_c,
                pilihan_d,
                pilihan_e,
                jawaban,
                bobot,
                gambar,
                audio,
                video,
                status
            )
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                data.mapel_id,
                data.guru_id,
                data.jenis,
                data.pertanyaan,
                data.pilihan_a,
                data.pilihan_b,
                data.pilihan_c,
                data.pilihan_d,
                data.pilihan_e,
                data.jawaban,
                data.bobot,
                data.gambar,
                data.audio,
                data.video,
                data.status
            ],
            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }

            }

        );

    });

};

// ======================================
// CARI SOAL BERDASARKAN ID
// ======================================
exports.findById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM bank_soal WHERE id = ?",
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
// UPDATE SOAL
// ======================================

exports.update = (id, data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `
            UPDATE bank_soal
            SET
                mapel_id = ?,
                guru_id = ?,
                jenis = ?,
                pertanyaan = ?,
                pilihan_a = ?,
                pilihan_b = ?,
                pilihan_c = ?,
                pilihan_d = ?,
                pilihan_e = ?,
                jawaban = ?,
                bobot = ?,
                gambar = ?,
                audio = ?,
                video = ?,
                status = ?
            WHERE id = ?
            `,
            [

                data.mapel_id,

                data.guru_id,

                data.jenis,

                data.pertanyaan,

                data.pilihan_a,

                data.pilihan_b,

                data.pilihan_c,

                data.pilihan_d,

                data.pilihan_e,

                data.jawaban,

                data.bobot,

                data.gambar,

                data.audio,

                data.video,

                data.status,

                id

            ],
            function (err) {

                if (err) {

                    reject(err);

                } else {

                    resolve(this.changes);

                }

            }

        );

    });

};

// ======================================
// HAPUS SOAL
// ======================================
exports.delete = (id) => {

    return new Promise((resolve, reject) => {

        db.run(
            "DELETE FROM bank_soal WHERE id = ?",
            [id],
            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }

            }

        );

    });

};

// ======================================
// AMBIL MAPEL MILIK GURU
// ======================================
exports.getMapelGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT
                m.*
            FROM guru_mapel gm
            INNER JOIN mapel m
                ON gm.mapel_id = m.id
            WHERE gm.guru_id = ?
            ORDER BY m.nama_mapel
            `,

            [guruId],

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