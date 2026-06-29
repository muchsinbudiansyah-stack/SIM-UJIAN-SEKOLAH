const db = require("../config/database");

// ======================================
// TAMPILKAN SEMUA DATA KELAS
// ======================================
exports.getAll = () => {

    return new Promise((resolve, reject) => {

        db.all(
            "SELECT * FROM kelas ORDER BY tingkat, nama ASC",
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
// HITUNG JUMLAH KELAS
// ======================================
exports.count = () => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT COUNT(*) AS total FROM kelas",
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
// SIMPAN DATA KELAS
// ======================================
exports.create = (data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `INSERT INTO kelas
            (nama, tingkat, jurusan, wali_kelas)
            VALUES (?, ?, ?, ?)`,
            [
                data.nama,
                data.tingkat,
                data.jurusan,
                data.wali_kelas
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
// CARI KELAS BERDASARKAN ID
// ======================================
exports.findById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM kelas WHERE id = ?",
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
// UPDATE DATA KELAS
// ======================================
exports.update = (id, data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `UPDATE kelas
            SET
                nama = ?,
                tingkat = ?,
                jurusan = ?,
                wali_kelas = ?
            WHERE id = ?`,
            [
                data.nama,
                data.tingkat,
                data.jurusan,
                data.wali_kelas,
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
// HAPUS DATA KELAS
// ======================================
exports.delete = (id) => {

    return new Promise((resolve, reject) => {

        db.run(
            "DELETE FROM kelas WHERE id = ?",
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