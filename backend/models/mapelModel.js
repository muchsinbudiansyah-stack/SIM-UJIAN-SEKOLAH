const db = require("../config/database");

// ======================================
// TAMPILKAN SEMUA MAPEL
// ======================================
exports.getAll = () => {

    return new Promise((resolve, reject) => {

        db.all(
            "SELECT * FROM mapel ORDER BY nama_mapel ASC",
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
// HITUNG JUMLAH MAPEL
// ======================================
exports.count = () => {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT COUNT(*) AS total FROM mapel",
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
// SIMPAN MAPEL
// ======================================
exports.create = (data) => {

    return new Promise((resolve, reject) => {

        db.run(
            `INSERT INTO mapel
            (kode_mapel,nama_mapel,kkm,status)
            VALUES(?,?,?,?)`,
            [
                data.kode_mapel,
                data.nama_mapel,
                data.kkm,
                data.status
            ],
            function(err){

                if(err){
                    reject(err);
                }else{
                    resolve(this.lastID);
                }

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
            "SELECT * FROM mapel WHERE id = ?",
            [id],
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
// UPDATE MAPEL
// ======================================
exports.update = (id,data)=>{

    return new Promise((resolve,reject)=>{

        db.run(
            `UPDATE mapel
             SET
                kode_mapel=?,
                nama_mapel=?,
                kkm=?,
                status=?
             WHERE id=?`,
            [
                data.kode_mapel,
                data.nama_mapel,
                data.kkm,
                data.status,
                id
            ],
            function(err){

                if(err){
                    reject(err);
                }else{
                    resolve(this.changes);
                }

            }

        );

    });

};

// ======================================
// HAPUS MAPEL
// ======================================
exports.delete = (id)=>{

    return new Promise((resolve,reject)=>{

        db.run(
            "DELETE FROM mapel WHERE id=?",
            [id],
            function(err){

                if(err){
                    reject(err);
                }else{
                    resolve(this.changes);
                }

            }

        );

    });

};