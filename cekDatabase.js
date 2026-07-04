const db = require("./backend/config/database");

db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log("=== USERS ===");
        console.table(rows);
    }

    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        console.log("\n=== TABEL ===");
        console.table(tables);

        db.close();
    });
});