const db = require("./backend/config/database");

db.all(
    "SELECT id, username, role FROM users ORDER BY id",
    [],
    (err, rows) => {

        if (err) {
            console.error(err);
            return;
        }

        console.log("====================================");
        console.log("DATA USER");
        console.log("====================================");
        console.table(rows);

        db.all(
            "SELECT COUNT(*) AS total FROM siswa",
            [],
            (err, siswa) => {

                if (err) {
                    console.error(err);
                    return;
                }

                console.log("\n====================================");
                console.log("JUMLAH SISWA");
                console.log("====================================");
                console.table(siswa);

                db.close();

            }

        );

    }
);