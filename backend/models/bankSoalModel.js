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