const db = require("../config/database");

// ======================================
// SEMUA PESERTA
// ======================================

exports.getMonitoring = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                monitor_ujian.*,

                siswa.nama,

                siswa.nisn,

                kelas.nama AS kelas,

                ujian.nama_ujian,

                ujian.jumlah_soal,

                mapel.nama_mapel

            FROM monitor_ujian

            LEFT JOIN siswa
                ON monitor_ujian.siswa_id = siswa.id

            LEFT JOIN ujian
                ON monitor_ujian.ujian_id = ujian.id

            LEFT JOIN kelas
                ON siswa.kelas_id = kelas.id

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            ORDER BY monitor_ujian.last_activity DESC

            `,

            [],

            (err, rows) => {

                if (err) return reject(err);

                const sekarang = Date.now();

                rows.forEach(item => {

                    const terakhir = item.last_activity
                        ? new Date(item.last_activity).getTime()
                        : 0;

                    const selisih = (sekarang - terakhir) / 1000;

                    if (selisih <= 15) {

                        item.koneksi = "Online";

                    } else if (selisih <= 60) {

                        item.koneksi = "Idle";

                    } else {

                        item.koneksi = "Offline";

                    }

                });

                resolve(rows);

            }

        );

    });

};

// ======================================
// DATA REALTIME
// ======================================

exports.getRealtime = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                monitor_ujian.*,

                siswa.nama,

                siswa.nisn,

                kelas.nama AS kelas,

                ujian.nama_ujian,

                ujian.jumlah_soal

            FROM monitor_ujian

            LEFT JOIN siswa
                ON siswa.id = monitor_ujian.siswa_id

            LEFT JOIN kelas
                ON kelas.id = siswa.kelas_id

            LEFT JOIN ujian
                ON ujian.id = monitor_ujian.ujian_id

            ORDER BY monitor_ujian.last_activity DESC

            `,

            [],

            (err, rows) => {

                if (err) return reject(err);

                const sekarang = Date.now();

                rows.forEach(item => {

                    const terakhir = item.last_activity
                        ? new Date(item.last_activity).getTime()
                        : 0;

                    const selisih = (sekarang - terakhir) / 1000;

                    if (selisih <= 15) {

                        item.koneksi = "Online";

                    } else if (selisih <= 60) {

                        item.koneksi = "Idle";

                    } else {

                        item.koneksi = "Offline";

                    }

                });

                resolve(rows);

            }

        );

    });

};

// ======================================
// RINGKASAN
// ======================================

exports.getSummary = () => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN status='Sedang Ujian'

                            THEN 1

                            ELSE 0

                        END

                    ),0

                ) AS sedang,

                COALESCE(

                    SUM(

                        CASE

                            WHEN status='Selesai'

                            THEN 1

                            ELSE 0

                        END

                    ),0

                ) AS selesai

            FROM monitor_ujian

            `,

            (err, row) => {

                if (err) return reject(err);

                resolve(row);

            }

        );

    });

};