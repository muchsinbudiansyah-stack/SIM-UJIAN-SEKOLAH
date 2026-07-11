const db = require("../config/database");

// ======================================
// DASHBOARD ADMIN
// ======================================

exports.getStatistik = () => {

    return new Promise((resolve, reject) => {

        const statistik = {};

        db.get(
            "SELECT COUNT(*) AS total FROM guru",
            (err, row) => {

                if (err) return reject(err);

                statistik.guru = row.total;

                db.get(
                    "SELECT COUNT(*) AS total FROM siswa",
                    (err, row) => {

                        if (err) return reject(err);

                        statistik.siswa = row.total;

                        db.get(
                            "SELECT COUNT(*) AS total FROM kelas",
                            (err, row) => {

                                if (err) return reject(err);

                                statistik.kelas = row.total;

                                db.get(
                                    "SELECT COUNT(*) AS total FROM mapel",
                                    (err, row) => {

                                        if (err) return reject(err);

                                        statistik.mapel = row.total;

                                        db.get(
                                            "SELECT COUNT(*) AS total FROM ujian",
                                            (err, row) => {

                                                if (err) return reject(err);

                                                statistik.ujian = row.total;

                                                db.get(
                                                    "SELECT COUNT(*) AS total FROM monitor_ujian WHERE status='Sedang Ujian'",
                                                    (err, row) => {

                                                        if (err) return reject(err);

                                                        statistik.sedang = row.total;

                                                        db.get(
                                                            "SELECT COUNT(*) AS total FROM monitor_ujian WHERE status='Selesai'",
                                                            (err, row) => {

                                                                if (err) return reject(err);

                                                                statistik.selesai = row.total;

                                                                db.get(
                                                                    "SELECT COUNT(*) AS total FROM bank_soal",
                                                                    (err, row) => {

                                                                        if (err) return reject(err);

                                                                        statistik.bankSoal = row.total;

                                                                        resolve(statistik);

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

                            }
                        );

                    }
                );

            }
        );

    });

};

// ======================================
// AKTIVITAS TERBARU
// ======================================

exports.getAktivitasTerbaru = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `SELECT

                ujian.nama_ujian,

                monitor_ujian.status,

                monitor_ujian.waktu_mulai,

                monitor_ujian.waktu_selesai

            FROM monitor_ujian

            LEFT JOIN ujian
                ON monitor_ujian.ujian_id = ujian.id

            ORDER BY monitor_ujian.last_activity DESC

            LIMIT 10`,

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows);

            }

        );

    });

};