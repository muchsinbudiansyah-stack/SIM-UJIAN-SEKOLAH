const db = require("../config/database");

// ======================================
// TAMPILKAN SEMUA DATA GURU
// ======================================
exports.getAll = () => {

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
// HITUNG JUMLAH GURU
// ======================================
exports.count = () => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT COUNT(*) AS total FROM guru",
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
// SIMPAN DATA GURU
// ======================================
exports.create = (data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `INSERT INTO guru
            (nip,nama,email,hp,mapel,foto)
            VALUES(?,?,?,?,?,?)`,
            [
                data.nip,
                data.nama,
                data.email,
                data.hp,
                data.mapel,
                data.foto
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
// CARI GURU BERDASARKAN ID
// ======================================
exports.findById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM guru WHERE id = ?",
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
// UPDATE DATA GURU
// ======================================
exports.update = (id, data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `UPDATE guru
            SET
                nip = ?,
                nama = ?,
                email = ?,
                hp = ?,
                mapel = ?
            WHERE id = ?`,
            [
                data.nip,
                data.nama,
                data.email,
                data.hp,
                data.mapel,
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
// HAPUS DATA GURU
// ======================================
exports.delete = (id) => {

    return new Promise((resolve, reject) => {

        db.run(
            "DELETE FROM guru WHERE id = ?",
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