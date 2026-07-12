const db = require("../config/database");

// ======================================
// ANALISIS BUTIR SOAL
// ======================================

exports.getAnalisisButir = (ujian_id) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                bs.id,

                bs.pertanyaan,

                bs.kunci_jawaban,

                COUNT(j.id) AS dijawab,

                SUM(
                    CASE
                        WHEN j.jawaban = bs.kunci_jawaban
                        THEN 1
                        ELSE 0
                    END
                ) AS benar,

                SUM(
                    CASE
                        WHEN j.jawaban != bs.kunci_jawaban
                        THEN 1
                        ELSE 0
                    END
                ) AS salah

            FROM bank_soal bs

            LEFT JOIN jawaban_siswa j
                ON bs.id = j.soal_id
                AND j.ujian_id = ?

            GROUP BY bs.id

            ORDER BY bs.id
            `,

            [ujian_id],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                rows.forEach(item => {

                    const total = Number(item.dijawab) || 0;
                    const benar = Number(item.benar) || 0;

                    item.persen =
                        total > 0
                            ? ((benar / total) * 100).toFixed(2)
                            : "0.00";

                    const p = Number(item.persen);

                    if (p >= 80) {

                        item.kategori = "Mudah";

                    } else if (p >= 40) {

                        item.kategori = "Sedang";

                    } else {

                        item.kategori = "Sulit";

                    }

                });

                resolve(rows);

            }

        );

    });

};