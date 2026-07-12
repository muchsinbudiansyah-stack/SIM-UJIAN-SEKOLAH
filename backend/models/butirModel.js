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

                COUNT(js.id) AS jumlah_dijawab,

                COALESCE(SUM(js.benar),0) AS jumlah_benar,

                COUNT(js.id)-COALESCE(SUM(js.benar),0) AS jumlah_salah

            FROM bank_soal bs

            LEFT JOIN jawaban_siswa js

                ON bs.id = js.soal_id

                AND js.ujian_id = ?

            GROUP BY bs.id

            ORDER BY bs.id
            `,

            [ujian_id],

            (err, rows) => {

                if(err){

                    return reject(err);

                }

                rows.forEach(item=>{

                    const total = Number(item.jumlah_dijawab);

                    const benar = Number(item.jumlah_benar);

                    item.persen =

                        total>0

                        ? ((benar/total)*100).toFixed(2)

                        : "0.00";

                    if(item.persen>=80){

                        item.kategori="Mudah";

                    }

                    else if(item.persen>=40){

                        item.kategori="Sedang";

                    }

                    else{

                        item.kategori="Sulit";

                    }

                });

                resolve(rows);

            }

        );

    });

};