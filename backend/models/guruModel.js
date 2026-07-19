const db = require("../config/database");
const bcrypt = require("bcrypt");

// ======================================
// AMBIL SEMUA MAPEL
// ======================================

exports.getAllMapel = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT *
            FROM mapel
            ORDER BY nama_mapel ASC
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
// AMBIL MAPEL GURU
// ======================================

exports.getMapelGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT
                gm.id,
                gm.guru_id,
                gm.mapel_id,
                m.nama_mapel
            FROM guru_mapel gm

            INNER JOIN mapel m
                ON gm.mapel_id = m.id

            WHERE gm.guru_id = ?

            ORDER BY m.nama_mapel ASC
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
// TAMPILKAN SEMUA DATA GURU
// ======================================

exports.getAll = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT *
            FROM guru
            ORDER BY nama ASC
            `,

            [],

            async (err, rows) => {

                if (err) {

                    return reject(err);

                }

                try {

                    for (const guru of rows) {

                        const mapel =
                            await exports.getMapelGuru(guru.id);

                        guru.mapel_list = mapel;

                        guru.mapel_text =
                            mapel
                                .map(item => item.nama_mapel)
                                .join(", ");

                    }

                    resolve(rows);

                } catch (e) {

                    reject(e);

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

            `
            SELECT COUNT(*) AS total
            FROM guru
            `,

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
// CARI GURU BERDASARKAN ID
// ======================================

exports.findById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *
            FROM guru
            WHERE id = ?
            `,

            [id],

            async (err, guru) => {

                if (err) {

                    return reject(err);

                }

                if (!guru) {

                    return resolve(null);

                }

                try {

                    guru.mapel_list =
                        await exports.getMapelGuru(guru.id);

                    guru.mapel =
                        guru.mapel_list.map(item => item.mapel_id);

                    resolve(guru);

                } catch (e) {

                    reject(e);

                }

            }

        );

    });

};

// ======================================
// SIMPAN DATA GURU + BUAT LOGIN
// ======================================

exports.create = async (data) => {

    return new Promise(async (resolve, reject) => {

        try {

            const passwordHash = await bcrypt.hash("123456", 10);

            db.serialize(() => {

                db.run("BEGIN TRANSACTION");

                db.run(

                    `
                    INSERT INTO guru
                    (
                        nip,
                        nama,
                        email,
                        hp,
                        mapel,
                        foto
                    )
                    VALUES
                    (
                        ?,?,?,?,?,?
                    )
                    `,

                    [

                        data.nip,
                        data.nama,
                        data.email,
                        data.hp,

                        // Kolom lama tetap dikosongkan
                        "",

                        data.foto || ""

                    ],

                    function (err) {

                        if (err) {

                            db.run("ROLLBACK");

                            return reject(err);

                        }

                        const guruId = this.lastID;

                        let daftarMapel = [];

                        if (Array.isArray(data.mapel)) {

                            daftarMapel = data.mapel;

                        } else if (data.mapel) {

                            daftarMapel = [data.mapel];

                        }

                        const simpanMapel = (callback) => {

                            if (daftarMapel.length === 0) {

                                return callback();

                            }

                            const stmt = db.prepare(

                                `
                                INSERT INTO guru_mapel
                                (
                                    guru_id,
                                    mapel_id
                                )
                                VALUES
                                (
                                    ?,?
                                )
                                `

                            );

                            daftarMapel.forEach((mapelId) => {

                                stmt.run(

                                    guruId,

                                    mapelId

                                );

                            });

                            stmt.finalize(callback);

                        };

                        simpanMapel((errMapel) => {

                            if (errMapel) {

                                db.run("ROLLBACK");

                                return reject(errMapel);

                            }

                            db.run(

                                `
                                INSERT INTO users
                                (
                                    username,
                                    password,
                                    role
                                )
                                VALUES
                                (
                                    ?,?,?
                                )
                                `,

                                [

                                    data.nip,

                                    passwordHash,

                                    "guru"

                                ],

                                function (errUser) {

                                    if (errUser) {

                                        db.run("ROLLBACK");

                                        return reject(errUser);

                                    }

                                    db.run(

                                        "COMMIT",

                                        (errCommit) => {

                                            if (errCommit) {

                                                db.run("ROLLBACK");

                                                return reject(errCommit);

                                            }

                                            resolve(guruId);

                                        }

                                    );

                                }

                            );

                        });

                    }

                );

            });

        } catch (err) {

            reject(err);

        }

    });

};

// ======================================
// UPDATE DATA GURU
// ======================================

exports.update = (id, data) => {

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            db.run(

                `
                UPDATE guru
                SET
                    nip = ?,
                    nama = ?,
                    email = ?,
                    hp = ?,
                    mapel = ?
                WHERE id = ?
                `,

                [

                    data.nip,

                    data.nama,

                    data.email,

                    data.hp,

                    "",

                    id

                ],

                function (err) {

                    if (err) {

                        db.run("ROLLBACK");

                        return reject(err);

                    }

                    db.run(

                        `
                        DELETE FROM guru_mapel
                        WHERE guru_id = ?
                        `,

                        [id],

                        (errDelete) => {

                            if (errDelete) {

                                db.run("ROLLBACK");

                                return reject(errDelete);

                            }

                            let daftarMapel = [];

                            if (Array.isArray(data.mapel)) {

                                daftarMapel = data.mapel;

                            } else if (data.mapel) {

                                daftarMapel = [data.mapel];

                            }

                            if (daftarMapel.length === 0) {

                                db.run(

                                    "COMMIT",

                                    (errCommit) => {

                                        if (errCommit) {

                                            db.run("ROLLBACK");

                                            return reject(errCommit);

                                        }

                                        resolve(true);

                                    }

                                );

                                return;

                            }

                            const stmt = db.prepare(

                                `
                                INSERT INTO guru_mapel
                                (
                                    guru_id,
                                    mapel_id
                                )
                                VALUES
                                (
                                    ?,?
                                )
                                `

                            );

                            daftarMapel.forEach((mapelId) => {

                                stmt.run(

                                    id,

                                    mapelId

                                );

                            });

                            stmt.finalize((errMapel) => {

                                if (errMapel) {

                                    db.run("ROLLBACK");

                                    return reject(errMapel);

                                }

                                db.run(

                                    "COMMIT",

                                    (errCommit) => {

                                        if (errCommit) {

                                            db.run("ROLLBACK");

                                            return reject(errCommit);

                                        }

                                        resolve(true);

                                    }

                                );

                            });

                        }

                    );

                }

            );

        });

    });

};

// ======================================
// HAPUS DATA GURU
// ======================================

exports.delete = (id) => {

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            db.run(

                `
                DELETE FROM guru_mapel
                WHERE guru_id = ?
                `,

                [id],

                (err) => {

                    if (err) {

                        db.run("ROLLBACK");

                        return reject(err);

                    }

                    db.get(

                        `
                        SELECT nip
                        FROM guru
                        WHERE id = ?
                        `,

                        [id],

                        (errGuru, guru) => {

                            if (errGuru) {

                                db.run("ROLLBACK");

                                return reject(errGuru);

                            }

                            db.run(

                                `
                                DELETE FROM guru
                                WHERE id = ?
                                `,

                                [id],

                                (errDeleteGuru) => {

                                    if (errDeleteGuru) {

                                        db.run("ROLLBACK");

                                        return reject(errDeleteGuru);

                                    }

                                    if (!guru) {

                                        db.run("COMMIT");

                                        return resolve(true);

                                    }

                                    db.run(

                                        `
                                        DELETE FROM users
                                        WHERE username = ?
                                        AND role = 'guru'
                                        `,

                                        [

                                            guru.nip

                                        ],

                                        (errUser) => {

                                            if (errUser) {

                                                db.run("ROLLBACK");

                                                return reject(errUser);

                                            }

                                            db.run(

                                                "COMMIT",

                                                (errCommit) => {

                                                    if (errCommit) {

                                                        db.run("ROLLBACK");

                                                        return reject(errCommit);

                                                    }

                                                    resolve(true);

                                                }

                                            );

                                        }

                                    );

                                }

                            );

                        }

                    );

                }

            );

        });

    });

};

// ======================================
// CARI GURU BERDASARKAN NIP
// ======================================

exports.getByNIP = (nip) => {

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
// AMBIL GURU BERDASARKAN USERNAME LOGIN
// ======================================

exports.getByUser = (username) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *
            FROM guru
            WHERE nip = ?
            `,

            [

                username

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
// AMBIL DAFTAR MAPEL GURU
// ======================================

exports.getMapelByGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                m.*

            FROM guru_mapel gm

            INNER JOIN mapel m

                ON gm.mapel_id = m.id

            WHERE gm.guru_id = ?

            ORDER BY m.nama_mapel ASC
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
// AMBIL SEMUA ID MAPEL MILIK GURU
// ======================================

exports.getGuruMapelIds = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT
                mapel_id
            FROM guru_mapel
            WHERE guru_id = ?
            ORDER BY mapel_id
            `,

            [guruId],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows.map(row => row.mapel_id));

            }

        );

    });

};

// ======================================
// AMBIL PILIHAN MAPEL GURU
// ======================================

exports.getMapelOptionsByGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                m.id,
                m.kode_mapel,
                m.nama_mapel,
                m.kkm,
                m.status

            FROM guru_mapel gm

            INNER JOIN mapel m

                ON gm.mapel_id = m.id

            WHERE gm.guru_id = ?

            ORDER BY m.nama_mapel ASC
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
// CEK APAKAH GURU MENGAJAR MAPEL INI
// ======================================

exports.isGuruMengajarMapel = (guruId, mapelId) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT
                id
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
// AMBIL JUMLAH MAPEL YANG DIAJAR GURU
// ======================================

exports.countMapelGuru = (guruId) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT
                COUNT(*) AS total
            FROM guru_mapel
            WHERE guru_id = ?
            `,

            [guruId],

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
// CEK GURU SUDAH PUNYA MAPEL
// ======================================

exports.hasMapel = async (guruId) => {

    const total = await exports.countMapelGuru(guruId);

    return total > 0;

};

// ======================================
// AMBIL GURU BESERTA MAPEL
// ======================================

exports.getGuruWithMapel = async (guruId) => {

    const guru = await exports.findById(guruId);

    if (!guru) {

        return null;

    }

    guru.mapel_list =
        await exports.getMapelByGuru(guruId);

    return guru;

};

// ======================================
// AMBIL GURU BERDASARKAN USER LOGIN
// ======================================

exports.getGuruLogin = async (username) => {

    const guru =
        await exports.getByUser(username);

    if (!guru) {

        return null;

    }

    guru.mapel_list =
        await exports.getMapelByGuru(guru.id);

    return guru;

};

// ======================================
// AMBIL SATU MAPEL GURU
// ======================================

exports.getFirstMapelGuru = async (guruId) => {

    const mapel =
        await exports.getMapelByGuru(guruId);

    if (!mapel || mapel.length === 0) {

        return null;

    }

    return mapel[0];

};

// ======================================
// CEK APAKAH GURU MEMILIKI LEBIH DARI
// SATU MAPEL
// ======================================

exports.hasMultipleMapel = async (guruId) => {

    const total =
        await exports.countMapelGuru(guruId);

    return total > 1;

};

// ======================================
// AMBIL NAMA MAPEL GURU
// ======================================

exports.getNamaMapelGuru = async (guruId) => {

    const list =
        await exports.getMapelByGuru(guruId);

    return list.map(item => item.nama_mapel);

};

// ======================================
// AMBIL STRING MAPEL
// ======================================

exports.getMapelText = async (guruId) => {

    const list =
        await exports.getMapelByGuru(guruId);

    return list
        .map(item => item.nama_mapel)
        .join(", ");

};

// ======================================
// REFRESH RELASI MAPEL GURU
// ======================================

exports.refreshMapelGuru = (guruId, mapel) => {

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run(

                `
                DELETE FROM guru_mapel
                WHERE guru_id = ?
                `,

                [guruId],

                (err) => {

                    if (err) {

                        return reject(err);

                    }

                    if (!mapel) {

                        return resolve(true);

                    }

                    let daftar = [];

                    if (Array.isArray(mapel)) {

                        daftar = mapel;

                    } else {

                        daftar = [mapel];

                    }

                    if (daftar.length === 0) {

                        return resolve(true);

                    }

                    const stmt = db.prepare(

                        `
                        INSERT INTO guru_mapel
                        (
                            guru_id,
                            mapel_id
                        )
                        VALUES
                        (
                            ?,?
                        )
                        `

                    );

                    daftar.forEach(idMapel => {

                        stmt.run(

                            guruId,

                            idMapel

                        );

                    });

                    stmt.finalize((err2) => {

                        if (err2) {

                            reject(err2);

                        } else {

                            resolve(true);

                        }

                    });

                }

            );

        });

    });

};