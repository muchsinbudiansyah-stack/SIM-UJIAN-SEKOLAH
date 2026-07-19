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
                bs.id AS nomor,
                bs.pertanyaan,

                COUNT(js.id) AS jumlah_dijawab,

                COALESCE(SUM(js.benar),0) AS benar,

                COUNT(js.id) - COALESCE(SUM(js.benar),0) AS salah

            FROM bank_soal bs

            LEFT JOIN jawaban_siswa js

                ON bs.id = js.soal_id
                AND js.ujian_id = ?

            GROUP BY bs.id

            ORDER BY bs.id
            `,

            [ujian_id],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                rows.forEach(item => {

                    const total = Number(item.jumlah_dijawab);
                    const benar = Number(item.benar);
                    const salah = Number(item.salah);

                    item.total = total;

                    item.persentase =
                        total > 0
                            ? ((benar / total) * 100).toFixed(2)
                            : "0.00";

                    item.persentaseSalah =
                        total > 0
                            ? ((salah / total) * 100).toFixed(2)
                            : "0.00";

                    // ===========================
                    // Tingkat Kesukaran
                    // ===========================

                    if (Number(item.persentase) >= 80) {

                        item.kategori = "Mudah";
                        item.badge = "success";

                    } else if (Number(item.persentase) >= 40) {

                        item.kategori = "Sedang";
                        item.badge = "warning";

                    } else {

                        item.kategori = "Sulit";
                        item.badge = "danger";

                    }

                    // ===========================
                    // Status Soal
                    // ===========================

                    if (Number(item.persentase) >= 90) {

                        item.status = "Terlalu Mudah";

                    } else if (Number(item.persentase) <= 20) {

                        item.status = "Terlalu Sulit";

                    } else {

                        item.status = "Baik";

                    }

                    // ===========================
                    // Rekomendasi
                    // ===========================

                    switch (item.status) {

                        case "Baik":
                            item.rekomendasi = "Dipertahankan";
                            break;

                        case "Terlalu Mudah":
                            item.rekomendasi = "Direvisi";
                            break;

                        case "Terlalu Sulit":
                            item.rekomendasi = "Direvisi";
                            break;

                        default:
                            item.rekomendasi = "-";

                    }

                });

                resolve(rows);

            }

        );

    });

};

// ======================================
// TOP 5 SOAL TERSULIT
// ======================================

exports.getTopSoalSulit = async (ujian_id) => {

    const data = await exports.getAnalisisButir(ujian_id);

    return data
        .sort((a, b) => Number(a.persentase) - Number(b.persentase))
        .slice(0, 5);

};

// ======================================
// TOP 5 SOAL TERMUDAH
// ======================================

exports.getTopSoalMudah = async (ujian_id) => {

    const data = await exports.getAnalisisButir(ujian_id);

    return data
        .sort((a, b) => Number(b.persentase) - Number(a.persentase))
        .slice(0, 5);

};