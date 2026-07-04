const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbFolder = path.join(__dirname, "../../database");

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

const dbPath = path.join(dbFolder, "simujian.db");

const db = new sqlite3.Database(dbPath, (err) => {
    console.log("DATABASE PATH:", dbPath);
    
    if (err) {
        console.error("Gagal membuka database:", err.message);
    } else {
        console.log("SQLite berhasil terhubung.");
    }
});

module.exports = db;