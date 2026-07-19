const db = require("../config/database");

// ======================================
// TAMPILKAN SEMUA UJIAN
// ======================================
exports.getAll = () => {

    return new Promise((resolve, reject) => {

        db.all(
            `
            SELECT
                ujian.*,
                mapel.nama_mapel,
                kelas.nama AS nama_kelas,
                guru.nama AS nama_guru
            FROM ujian

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            LEFT JOIN kelas
                ON ujian.kelas_id = kelas.id

            LEFT JOIN guru
                ON ujian.guru_id = guru.id

            ORDER BY ujian.id DESC
            `,
            [],
            (err, rows) => {

                if (err) reject(err);
                else resolve(rows);

            }

        );

    });

};

// ======================================
// HITUNG JUMLAH UJIAN
// ======================================
exports.count = () => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT COUNT(*) AS total FROM ujian",
            [],
            (err, row) => {

                if (err) reject(err);
                else resolve(row.total);

            }

        );

    });

};

// ======================================
// AMBIL MAPEL
// ======================================
exports.getMapel = () => {

    return new Promise((resolve, reject) => {

        db.all(
            "SELECT * FROM mapel ORDER BY nama_mapel ASC",
            [],
            (err, rows) => {

                if (err) reject(err);
                else resolve(rows);

            }

        );

    });

};

// ======================================
// AMBIL KELAS
// ======================================
exports.getKelas = () => {

    return new Promise((resolve, reject) => {

        db.all(
            "SELECT * FROM kelas ORDER BY nama ASC",
            [],
            (err, rows) => {

                if (err) reject(err);
                else resolve(rows);

            }

        );

    });

};

// ======================================
// AMBIL GURU
// ======================================
exports.getGuru = () => {

    return new Promise((resolve, reject) => {

        db.all(
            "SELECT * FROM guru ORDER BY nama ASC",
            [],
            (err, rows) => {

                if (err) reject(err);
                else resolve(rows);

            }

        );

    });

};

// ======================================
// SIMPAN UJIAN
// ======================================
exports.create = (data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `
            INSERT INTO ujian
            (
                nama_ujian,
                mapel_id,
                kelas_id,
                guru_id,
                tanggal,
                jam_mulai,
                jam_selesai,
                durasi,
                jumlah_soal,
                acak_soal,
                acak_jawaban,
                token,
                status
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                data.nama_ujian,
                data.mapel_id,
                data.kelas_id,
                data.guru_id,
                data.tanggal,
                data.jam_mulai,
                data.jam_selesai,
                data.durasi,
                data.jumlah_soal,
                data.acak_soal,
                data.acak_jawaban,
                data.token,
                data.status
            ],
            function (err) {

                if (err) reject(err);
                else resolve(this.lastID);

            }

        );

    });

};

// ======================================
// CARI BERDASARKAN ID
// ======================================
exports.findById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM ujian WHERE id = ?",
            [id],
            (err, row) => {

                if (err) reject(err);
                else resolve(row);

            }

        );

    });

};

// ======================================
// UPDATE UJIAN
// ======================================
exports.update = (id, data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `
            UPDATE ujian
            SET
                nama_ujian = ?,
                mapel_id = ?,
                kelas_id = ?,
                guru_id = ?,
                tanggal = ?,
                jam_mulai = ?,
                jam_selesai = ?,
                durasi = ?,
                jumlah_soal = ?,
                acak_soal = ?,
                acak_jawaban = ?,
                token = ?,
                status = ?
            WHERE id = ?
            `,
            [
                data.nama_ujian,
                data.mapel_id,
                data.kelas_id,
                data.guru_id,
                data.tanggal,
                data.jam_mulai,
                data.jam_selesai,
                data.durasi,
                data.jumlah_soal,
                data.acak_soal,
                data.acak_jawaban,
                data.token,
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
// HAPUS UJIAN
// ======================================
exports.delete = (id) => {

    return new Promise((resolve, reject) => {

        db.run(
            "DELETE FROM ujian WHERE id = ?",
            [id],
            function (err) {

                if (err) reject(err);
                else resolve(this.changes);

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

            WHERE guru_mapel.guru_id = ?

            ORDER BY mapel.nama_mapel ASC
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

// ======================================
// CEK APAKAH GURU MENGAJAR MAPEL
// ======================================
exports.isGuruMengajarMapel = (

    guruId,

    mapelId

) => {

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
// UJIAN BERDASARKAN GURU
// ======================================
exports.getByGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                ujian.*,

                mapel.nama_mapel,

                kelas.nama AS nama_kelas,

                guru.nama AS nama_guru

            FROM ujian

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            LEFT JOIN kelas
                ON ujian.kelas_id = kelas.id

            LEFT JOIN guru
                ON ujian.guru_id = guru.id

            WHERE ujian.guru_id = ?

            ORDER BY ujian.id DESC
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
// UJIAN BERDASARKAN GURU + MAPEL
// ======================================
exports.getByGuruMapel = (

    guruId,

    mapelId

) => {

    return new Promise((resolve, reject) => {

        let sql =

            `
            SELECT

                ujian.*,

                mapel.nama_mapel,

                kelas.nama AS nama_kelas,

                guru.nama AS nama_guru

            FROM ujian

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            LEFT JOIN kelas
                ON ujian.kelas_id = kelas.id

            LEFT JOIN guru
                ON ujian.guru_id = guru.id

            WHERE ujian.guru_id = ?
            `;

        const params = [

            guruId

        ];

        if (mapelId) {

            sql +=

                `
                AND ujian.mapel_id = ?
                `;

            params.push(mapelId);

        }

        sql +=

            `
            ORDER BY ujian.tanggal DESC,
                     ujian.jam_mulai ASC
            `;

        db.all(

            sql,

            params,

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
// DATA GURU LOGIN
// ======================================
exports.getGuruLogin = (username) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *
            FROM guru
            WHERE nip = ?
            `,

            [username],

            async (err, guru) => {

                if (err) {

                    return reject(err);

                }

                if (!guru) {

                    return resolve(null);

                }

                try {

                    guru.mapel_list =
                        await exports.getMapelGuru(
                            guru.id
                        );

                    resolve(guru);

                } catch (e) {

                    reject(e);

                }

            }

        );

    });

};

// ======================================
// MAPEL PERTAMA GURU
// ======================================
exports.getFirstMapelGuru = async (guruId) => {

    const mapel =
        await exports.getMapelGuru(
            guruId
        );

    if (!mapel.length) {

        return null;

    }

    return mapel[0];

};

// ======================================
// APAKAH GURU MENGAJAR
// LEBIH DARI SATU MAPEL
// ======================================
exports.hasMultipleMapel = async (guruId) => {

    const mapel =
        await exports.getMapelGuru(
            guruId
        );

    return mapel.length > 1;

};

// ======================================
// NAMA MAPEL GURU
// ======================================
exports.getNamaMapelGuru = async (guruId) => {

    const mapel =
        await exports.getMapelGuru(
            guruId
        );

    return mapel.map(

        item => item.nama_mapel

    ).join(", ");

};