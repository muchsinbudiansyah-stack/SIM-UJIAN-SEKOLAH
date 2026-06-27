const db = require("./database");

db.serialize(() => {

    // ==========================================
    // USERS
    // ==========================================
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            status INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ==========================================
    // ADMIN
    // ==========================================
    db.run(`
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            nama TEXT,
            email TEXT,
            hp TEXT
        )
    `);

    // ==========================================
    // GURU
    // ==========================================
    db.run(`
        CREATE TABLE IF NOT EXISTS guru (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nip TEXT UNIQUE,
            nama TEXT NOT NULL,
            email TEXT,
            hp TEXT,
            mapel TEXT,
            foto TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ==========================================
    // KELAS
    // ==========================================
    db.run(`
        CREATE TABLE IF NOT EXISTS kelas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            tingkat TEXT,
            jurusan TEXT,
            wali_kelas TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Database berhasil diinisialisasi.");

});