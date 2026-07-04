const db = require("../config/database");

exports.login = (nisn) => {

    return new Promise((resolve,reject)=>{

        db.get(

            `
            SELECT
            users.*,
            siswa.id as siswa_id,
            siswa.nama,
            siswa.kelas_id

            FROM users

            JOIN siswa
            ON users.id=siswa.user_id

            WHERE users.username=?
            AND users.role='siswa'
            `,
            [nisn],

            (err,row)=>{

                if(err) reject(err);

                else resolve(row);

            }

        );

    });

};

exports.getDaftarUjian = (kelas_id)=>{

    return new Promise((resolve,reject)=>{

        db.all(

            `
            SELECT *

            FROM ujian

            WHERE kelas_id=?
            AND status=1

            ORDER BY tanggal DESC
            `,

            [kelas_id],

            (err,rows)=>{

                if(err) reject(err);

                else resolve(rows);

            }

        );

    });

};