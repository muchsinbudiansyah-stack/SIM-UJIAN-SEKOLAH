const db = require("../config/database");

// ======================================
// LOGIN SISWA
// ======================================

exports.login = (nisn) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                users.id,
                users.username,
                users.password,
                users.role,

                siswa.id AS siswa_id,
                siswa.nama,
                siswa.kelas_id

            FROM users

            INNER JOIN siswa
                ON users.username = siswa.nisn

            WHERE users.username = ?
            AND users.role='siswa'
        `;

        db.get(

            sql,

            [nisn],

            (err,row)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(row);

                }

            }

        );

    });

};

// ======================================
// DAFTAR UJIAN SISWA
// ======================================

exports.getDaftarUjian = (kelas_id)=>{

    return new Promise((resolve,reject)=>{

        db.all(

            `
            SELECT

                ujian.*,

                mapel.nama_mapel,

                guru.nama AS nama_guru

            FROM ujian

            LEFT JOIN mapel

                ON ujian.mapel_id=mapel.id

            LEFT JOIN guru

                ON ujian.guru_id=guru.id

            WHERE

                ujian.kelas_id=?

            AND

                ujian.status=1

            ORDER BY

                ujian.tanggal DESC,

                ujian.jam_mulai ASC
            `,

            [

                kelas_id

            ],

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
// CARI UJIAN BERDASARKAN ID
// ======================================

exports.getUjianById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT

                ujian.*,

                mapel.nama_mapel,

                guru.nama AS nama_guru

            FROM ujian

            LEFT JOIN mapel
                ON ujian.mapel_id = mapel.id

            LEFT JOIN guru
                ON ujian.guru_id = guru.id

            WHERE ujian.id = ?
            `,

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
// AMBIL SEMUA SOAL
// ======================================

exports.getSemuaSoal = (mapel_id) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                id,

                pertanyaan,

                pilihan_a,
                pilihan_b,
                pilihan_c,
                pilihan_d,
                pilihan_e,

                jenis,

                gambar,

                audio,

                video,

                bobot

            FROM bank_soal

            WHERE

                mapel_id = ?

            AND

                status = 1

            ORDER BY id ASC
            `,

            [

                mapel_id

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
// AMBIL JAWABAN SISWA
// ======================================

exports.getJawaban = (

    ujian_id,

    siswa_id,

    soal_id

) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT

                jawaban

            FROM jawaban_siswa

            WHERE

                ujian_id = ?

            AND

                siswa_id = ?

            AND

                soal_id = ?
            `,

            [

                ujian_id,

                siswa_id,

                soal_id

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
// SIMPAN JAWABAN SISWA
// ======================================

exports.simpanJawaban = (data) => {

    return new Promise((resolve, reject) => {

        // Cek apakah jawaban sudah ada
        db.get(

            `
            SELECT id

            FROM jawaban_siswa

            WHERE

                ujian_id = ?

            AND siswa_id = ?

            AND soal_id = ?
            `,

            [

                data.ujian_id,

                data.siswa_id,

                data.soal_id

            ],

            (err, row) => {

                if (err) {

                    return reject(err);

                }

                // =====================================
                // UPDATE
                // =====================================

                if (row) {

                    db.run(

                        `
                        UPDATE jawaban_siswa

                        SET

                            jawaban = ?

                        WHERE id = ?
                        `,

                        [

                            data.jawaban,

                            row.id

                        ],

                        function(err){

                            if(err){

                                reject(err);

                            }else{

                                resolve(true);

                            }

                        }

                    );

                }

                // =====================================
                // INSERT
                // =====================================

                else{

                    db.run(

                        `
                        INSERT INTO jawaban_siswa

                        (

                            ujian_id,

                            siswa_id,

                            soal_id,

                            jawaban

                        )

                        VALUES(?,?,?,?)
                        `,

                        [

                            data.ujian_id,

                            data.siswa_id,

                            data.soal_id,

                            data.jawaban

                        ],

                        function(err){

                            if(err){

                                reject(err);

                            }else{

                                resolve(true);

                            }

                        }

                    );

                }

            }

        );

    });

};

// ======================================
// AMBIL SEMUA JAWABAN SISWA
// ======================================

exports.getSemuaJawaban = (

    ujian_id,

    siswa_id

)=>{

    return new Promise((resolve,reject)=>{

        db.all(

            `
            SELECT

                soal_id,

                jawaban

            FROM jawaban_siswa

            WHERE

                ujian_id=?

            AND

                siswa_id=?
            `,

            [

                ujian_id,

                siswa_id

            ],

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
// HITUNG NILAI
// ======================================

exports.hitungNilai = (

    ujian_id,

    siswa_id

)=>{

    return new Promise((resolve,reject)=>{

        db.get(

            `
            SELECT

                COUNT(*) AS benar

            FROM jawaban_siswa js

            INNER JOIN bank_soal bs

                ON js.soal_id=bs.id

            WHERE

                js.ujian_id=?

            AND

                js.siswa_id=?

            AND

                js.jawaban=bs.jawaban
            `,

            [

                ujian_id,

                siswa_id

            ],

            (err,row)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(row.benar);

                }

            }

        );

    });

};

// ======================================
// SIMPAN HASIL UJIAN
// ======================================

exports.simpanHasil = (data) => {

    return new Promise((resolve, reject) => {

        db.run(

            `
            INSERT OR REPLACE INTO hasil_ujian
            (
                ujian_id,
                siswa_id,
                jumlah_soal,
                benar,
                salah,
                kosong,
                nilai
            )
            VALUES(?,?,?,?,?,?,?)
            `,

            [
                data.ujian_id,
                data.siswa_id,
                data.jumlah_soal,
                data.benar,
                data.salah,
                data.kosong,
                data.nilai
            ],

            function(err){

    if(err){

        console.log("❌ GAGAL MENYIMPAN HASIL");
        console.log(err);

        reject(err);

    }else{

        console.log("✅ HASIL BERHASIL DISIMPAN");
        console.log("Row ID :", this.lastID);

        resolve(true);

    }

}

        );

    });

};

// ======================================
// AMBIL SEMUA JAWABAN + KUNCI
// ======================================

exports.getJawabanDanKunci = (ujian_id, siswa_id) => {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                js.jawaban,

                bs.jawaban AS kunci

            FROM jawaban_siswa js

            INNER JOIN bank_soal bs

                ON js.soal_id = bs.id

            WHERE

                js.ujian_id = ?

            AND

                js.siswa_id = ?
            `,

            [

                ujian_id,

                siswa_id

            ],

            (err, rows) => {

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
// MULAI MONITOR UJIAN
// ======================================

exports.mulaiMonitor = (data) => {

    return new Promise((resolve, reject) => {

        db.run(

            `
            INSERT OR IGNORE INTO monitor_ujian
            (

                ujian_id,

                siswa_id,

                status,

                nomor_terakhir,

                jumlah_dijawab,

                waktu_mulai,

                sisa_waktu

            )
            VALUES
            (
                ?, ?, 'Sedang Ujian', 1, 0, CURRENT_TIMESTAMP, ?
            )
            `,

            [

                data.ujian_id,

                data.siswa_id,

                data.sisa_waktu

            ],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(true);

                }

            }

        );

    });

};

// ======================================
// UPDATE MONITOR UJIAN
// ======================================

exports.updateMonitor = (data) => {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE monitor_ujian

            SET

                nomor_terakhir = ?,

                jumlah_dijawab = ?,

                last_activity = CURRENT_TIMESTAMP

            WHERE

                ujian_id = ?

            AND

                siswa_id = ?
            `,

            [

                data.nomor_terakhir,

                data.jumlah_dijawab,

                data.ujian_id,

                data.siswa_id

            ],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(true);

                }

            }

        );

    });

};

// ======================================
// HITUNG JUMLAH JAWABAN
// ======================================

exports.hitungJawaban = (ujian_id, siswa_id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT COUNT(*) AS total

            FROM jawaban_siswa

            WHERE

                ujian_id = ?

            AND

                siswa_id = ?
            `,

            [

                ujian_id,

                siswa_id

            ],

            (err, row) => {

                if(err){

                    reject(err);

                }else{

                    resolve(row.total);

                }

            }

        );

    });

};

// ======================================
// AMBIL DATA MONITOR
// ======================================

exports.getMonitor = (ujian_id, siswa_id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *

            FROM monitor_ujian

            WHERE

                ujian_id=?

            AND

                siswa_id=?
            `,

            [

                ujian_id,

                siswa_id

            ],

            (err,row)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(row);

                }

            }

        );

    });

};

// ======================================
// SIMPAN URUTAN SOAL
// ======================================

exports.simpanUrutanSoal = (ujian_id, siswa_id, urutan) => {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE monitor_ujian

            SET

                urutan_soal = ?

            WHERE

                ujian_id = ?

            AND

                siswa_id = ?
            `,

            [

                JSON.stringify(urutan),

                ujian_id,

                siswa_id

            ],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(true);

                }

            }

        );

    });

};

// ======================================
// AMBIL URUTAN SOAL
// ======================================

exports.getUrutanSoal = (ujian_id, siswa_id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT urutan_soal

            FROM monitor_ujian

            WHERE

                ujian_id = ?

            AND

                siswa_id = ?
            `,

            [

                ujian_id,

                siswa_id

            ],

            (err,row)=>{

                if(err){

                    reject(err);

                }else{

                    if(!row || !row.urutan_soal){

                        resolve(null);

                    }else{

                        resolve(JSON.parse(row.urutan_soal));

                    }

                }

            }

        );

    });

};

// ======================================
// AMBIL SOAL BERDASARKAN ID
// ======================================

exports.getSoalById = (id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *

            FROM bank_soal

            WHERE id = ?
            `,

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
// UPDATE SISA WAKTU
// ======================================

exports.updateSisaWaktu = (ujian_id, siswa_id, sisa_waktu) => {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE monitor_ujian

            SET

                sisa_waktu = ?,

                last_activity = CURRENT_TIMESTAMP

            WHERE

                ujian_id = ?

            AND

                siswa_id = ?
            `,

            [

                sisa_waktu,

                ujian_id,

                siswa_id

            ],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(true);

                }

            }

        );

    });

};

// ======================================
// AMBIL SISA WAKTU
// ======================================

exports.getSisaWaktu = (ujian_id, siswa_id) => {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT sisa_waktu

            FROM monitor_ujian

            WHERE

                ujian_id = ?

            AND

                siswa_id = ?
            `,

            [

                ujian_id,

                siswa_id

            ],

            (err,row)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(row);

                }

            }

        );

    });

};

// ======================================
// UPDATE STATUS
// ======================================

exports.updateStatus = (ujian_id, siswa_id, status) => {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE monitor_ujian

            SET

                status=?,

                last_activity=CURRENT_TIMESTAMP

            WHERE

                ujian_id=?

            AND

                siswa_id=?
            `,

            [

                status,

                ujian_id,

                siswa_id

            ],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(true);

                }

            }

        );

    });

};

// ======================================
// HEARTBEAT
// ======================================

exports.heartbeat = (ujian_id, siswa_id) => {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE monitor_ujian

            SET

                last_activity=CURRENT_TIMESTAMP

            WHERE

                ujian_id=?

            AND

                siswa_id=?
            `,

            [

                ujian_id,

                siswa_id

            ],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(true);

                }

            }

        );

    });

};

// ======================================
// SELESAI MONITOR
// ======================================

exports.selesaiMonitor = (ujian_id, siswa_id) => {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE monitor_ujian

            SET

                status='Selesai',

                waktu_selesai=CURRENT_TIMESTAMP,

                last_activity=CURRENT_TIMESTAMP

            WHERE

                ujian_id=?

            AND

                siswa_id=?
            `,

            [

                ujian_id,

                siswa_id

            ],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(true);

                }

            }

        );

    });

};