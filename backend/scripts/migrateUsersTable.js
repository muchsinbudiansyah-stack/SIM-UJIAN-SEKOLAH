const db = require("../config/database");

const queries = [
    "ALTER TABLE users ADD COLUMN guru_id INTEGER",
    "ALTER TABLE users ADD COLUMN siswa_id INTEGER",
    "ALTER TABLE users ADD COLUMN admin_id INTEGER",
    "ALTER TABLE users ADD COLUMN status INTEGER DEFAULT 1"
];

(async () => {

    for (const sql of queries) {

        await new Promise((resolve) => {

            db.run(sql, (err) => {

                if (err) {
                    console.log("Lewati:", err.message);
                } else {
                    console.log("Berhasil:", sql);
                }

                resolve();

            });

        });

    }

    console.log("Migrasi selesai.");

});