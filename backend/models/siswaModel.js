const db = require("../config/database");

// ======================================
// TAMPILKAN SEMUA SISWA
// ======================================
exports.getAll = () => {

    return new Promise((resolve, reject) => {

        db.all(
            `
            SELECT
                siswa.*,
                kelas.nama AS nama_kelas
            FROM siswa
            LEFT JOIN kelas
                ON siswa.kelas_id = kelas.id
            ORDER BY siswa.nama ASC
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
// HITUNG JUMLAH SISWA
// ======================================
exports.count = () => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT COUNT(*) AS total FROM siswa",
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
// AMBIL DATA KELAS
// ======================================
exports.getKelas = () => {

    return new Promise((resolve, reject) => {

        db.all(
            "SELECT * FROM kelas ORDER BY nama ASC",
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
// SIMPAN SISWA
// ======================================
exports.create = (data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `
            INSERT INTO siswa
            (
                nisn,
                nama,
                jenis_kelamin,
                kelas_id,
                tempat_lahir,
                tanggal_lahir,
                alamat,
                no_hp,
                foto
            )
            VALUES (?,?,?,?,?,?,?,?,?)
            `,
            [
                data.nisn,
                data.nama,
                data.jenis_kelamin,
                data.kelas_id,
                data.tempat_lahir,
                data.tanggal_lahir,
                data.alamat,
                data.no_hp,
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
// CARI SISWA BERDASARKAN ID
// ======================================
exports.findById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM siswa WHERE id = ?",
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
// UPDATE SISWA
// ======================================
exports.update = (id, data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `
            UPDATE siswa
            SET
                nisn = ?,
                nama = ?,
                jenis_kelamin = ?,
                kelas_id = ?,
                tempat_lahir = ?,
                tanggal_lahir = ?,
                alamat = ?,
                no_hp = ?
            WHERE id = ?
            `,
            [
                data.nisn,
                data.nama,
                data.jenis_kelamin,
                data.kelas_id,
                data.tempat_lahir,
                data.tanggal_lahir,
                data.alamat,
                data.no_hp,
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
// HAPUS SISWA
// ======================================
exports.delete = (id) => {

    return new Promise((resolve, reject) => {

        db.run(
            "DELETE FROM siswa WHERE id = ?",
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