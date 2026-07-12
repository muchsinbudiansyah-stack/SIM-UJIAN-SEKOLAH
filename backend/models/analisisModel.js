const db = require("../config/database");

// ======================================
// RINGKASAN NILAI
// ======================================

exports.getSummary = () => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT

                COUNT(*) AS jumlah_peserta,

                MAX(nilai) AS nilai_tertinggi,

                MIN(nilai) AS nilai_terendah,

                ROUND(AVG(nilai),2) AS rata_rata,

                SUM(
                    CASE
                        WHEN status='selesai'
                        THEN 1
                        ELSE 0
                    END
                ) AS selesai

            FROM hasil_ujian
            `,

            [],

            (err,row)=>{

                if(err){

                    return reject(err);

                }

                row.belum =
                    row.jumlah_peserta - row.selesai;

                resolve(row);

            }

        );

    });

};

// ======================================
// DAFTAR NILAI
// ======================================

exports.getNilai = ()=>{

    return new Promise((resolve,reject)=>{

        db.all(

            `
            SELECT

                hasil_ujian.*,

                siswa.nama,

                siswa.nisn,

                kelas.nama AS kelas,

                ujian.nama_ujian,

                mapel.nama_mapel

            FROM hasil_ujian

            LEFT JOIN siswa
            ON hasil_ujian.siswa_id=siswa.id

            LEFT JOIN kelas
            ON siswa.kelas_id=kelas.id

            LEFT JOIN ujian
            ON hasil_ujian.ujian_id=ujian.id

            LEFT JOIN mapel
            ON ujian.mapel_id=mapel.id

            ORDER BY nilai DESC

            `,

            [],

            (err,rows)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(rows);

                }

            }

        );

    });

};

// ======================================
// DISTRIBUSI NILAI
// ======================================

exports.getDistribusi = () => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT

                SUM(CASE WHEN nilai>=90 THEN 1 ELSE 0 END) AS a,

                SUM(CASE WHEN nilai>=80 AND nilai<90 THEN 1 ELSE 0 END) AS b,

                SUM(CASE WHEN nilai>=70 AND nilai<80 THEN 1 ELSE 0 END) AS c,

                SUM(CASE WHEN nilai>=60 AND nilai<70 THEN 1 ELSE 0 END) AS d,

                SUM(CASE WHEN nilai<60 THEN 1 ELSE 0 END) AS e

            FROM hasil_ujian
            `,

            [],

            (err,row)=>{

                if(err){

                    return reject(err);

                }

                resolve(row);

            }

        );

    });

};

// ======================================
// TOP 10 RANKING
// ======================================

exports.getTop10 = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                hasil_ujian.nilai,

                siswa.nama,

                siswa.nisn,

                kelas.nama AS kelas

            FROM hasil_ujian

            LEFT JOIN siswa
            ON hasil_ujian.siswa_id = siswa.id

            LEFT JOIN kelas
            ON siswa.kelas_id = kelas.id

            ORDER BY hasil_ujian.nilai DESC

            LIMIT 10
            `,

            [],

            (err, rows) => {

                if(err){

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

// ======================================
// STATISTIK KELULUSAN
// ======================================

exports.getKelulusan = () => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT

                SUM(
                    CASE
                        WHEN nilai >= 75
                        THEN 1
                        ELSE 0
                    END
                ) AS lulus,

                SUM(
                    CASE
                        WHEN nilai < 75
                        THEN 1
                        ELSE 0
                    END
                ) AS tidak_lulus

            FROM hasil_ujian
            `,

            [],

            (err, row) => {

                if(err){

                    return reject(err);

                }

                resolve(row);

            }

        );

    });

};

// ======================================
// AMBIL SEMUA NILAI
// ======================================

exports.getSemuaNilai = () => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT nilai

            FROM hasil_ujian

            ORDER BY nilai ASC
            `,

            [],

            (err, rows) => {

                if(err){

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};