const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "../../database/simujian.db");
const db = new sqlite3.Database(dbPath);

// KODE UNTUK CEK NAMA TABEL
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
        console.error("Gagal ambil daftar tabel:", err.message);
    } else {
        console.log("Daftar tabel di database:", tables.map(t => t.name));
    }
});

module.exports = db;