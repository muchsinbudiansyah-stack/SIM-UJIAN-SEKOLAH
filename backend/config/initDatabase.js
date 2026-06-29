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

    // ==========================================
    // MATA PELAJARAN
    // ==========================================
    db.run(`
        CREATE TABLE IF NOT EXISTS mapel (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kode_mapel TEXT UNIQUE,
            nama_mapel TEXT NOT NULL,
            kkm INTEGER DEFAULT 75,
            status INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ==========================================
// BANK SOAL
// ==========================================
db.run(`
    CREATE TABLE IF NOT EXISTS bank_soal (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        mapel_id INTEGER NOT NULL,

        guru_id INTEGER,

        jenis TEXT DEFAULT 'PG',

        pertanyaan TEXT NOT NULL,

        pilihan_a TEXT,

        pilihan_b TEXT,

        pilihan_c TEXT,

        pilihan_d TEXT,

        pilihan_e TEXT,

        jawaban TEXT,

        bobot INTEGER DEFAULT 1,

        gambar TEXT,

        audio TEXT,

        video TEXT,

        status INTEGER DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(mapel_id) REFERENCES mapel(id),

        FOREIGN KEY(guru_id) REFERENCES guru(id)

    )
`);

    // ==========================================
// SISWA
// ==========================================
db.run(`
    CREATE TABLE IF NOT EXISTS siswa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nisn TEXT UNIQUE,

        nama TEXT NOT NULL,

        jenis_kelamin TEXT,

        kelas_id INTEGER,

        tempat_lahir TEXT,

        tanggal_lahir TEXT,

        alamat TEXT,

        no_hp TEXT,

        foto TEXT,

        status INTEGER DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(kelas_id) REFERENCES kelas(id)
    )
`);

// ==========================================
// UJIAN
// ==========================================
db.run(`
    CREATE TABLE IF NOT EXISTS ujian (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nama_ujian TEXT NOT NULL,

        mapel_id INTEGER NOT NULL,

        kelas_id INTEGER NOT NULL,

        guru_id INTEGER NOT NULL,

        tanggal TEXT,

        jam_mulai TEXT,

        jam_selesai TEXT,

        durasi INTEGER DEFAULT 60,

        jumlah_soal INTEGER DEFAULT 20,

        acak_soal INTEGER DEFAULT 1,

        acak_jawaban INTEGER DEFAULT 1,

        token TEXT,

        status INTEGER DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(mapel_id) REFERENCES mapel(id),

        FOREIGN KEY(kelas_id) REFERENCES kelas(id),

        FOREIGN KEY(guru_id) REFERENCES guru(id)

    )
`);

    console.log("Database berhasil diinisialisasi.");

});