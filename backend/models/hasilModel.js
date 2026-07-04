const db = require("../config/database");

exports.getAllHasil = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT hasil_ujian.*, siswa.nama as nama_siswa 
            FROM hasil_ujian 
            JOIN siswa ON hasil_ujian.siswa_id = siswa.id
        `;
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.simpanHasil = (data) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO hasil_ujian (ujian_id, siswa_id, nama_mapel, skor_akhir, status, waktu_selesai) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [data.ujian_id, data.siswa_id, data.nama_mapel, data.skor_akhir, data.status, data.waktu_selesai], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};