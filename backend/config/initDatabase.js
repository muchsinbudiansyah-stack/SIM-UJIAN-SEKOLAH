const db = require("./database");

db.serialize(() => {

    console.log("====================================");
    console.log("INIT DATABASE");
    console.log("====================================");

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

        hp TEXT,

        FOREIGN KEY(user_id)
        REFERENCES users(id)

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
    // MAPEL
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

        FOREIGN KEY(mapel_id)
        REFERENCES mapel(id),

        FOREIGN KEY(guru_id)
        REFERENCES guru(id)

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

        FOREIGN KEY(kelas_id)
        REFERENCES kelas(id)

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

        FOREIGN KEY(mapel_id)
        REFERENCES mapel(id),

        FOREIGN KEY(kelas_id)
        REFERENCES kelas(id),

        FOREIGN KEY(guru_id)
        REFERENCES guru(id)

    )
    `);

        // ==========================================
    // JAWABAN SISWA
    // ==========================================

    db.run(`
    CREATE TABLE IF NOT EXISTS jawaban_siswa (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        ujian_id INTEGER NOT NULL,

        siswa_id INTEGER NOT NULL,

        soal_id INTEGER NOT NULL,

        jawaban TEXT,

        benar INTEGER DEFAULT 0,

        waktu_jawab DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE(ujian_id, siswa_id, soal_id),

        FOREIGN KEY(ujian_id)
        REFERENCES ujian(id),

        FOREIGN KEY(siswa_id)
        REFERENCES siswa(id),

        FOREIGN KEY(soal_id)
        REFERENCES bank_soal(id)

    )
    `);

    // ==========================================
    // HASIL UJIAN
    // ==========================================

    db.run(`
    CREATE TABLE IF NOT EXISTS hasil_ujian (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        ujian_id INTEGER NOT NULL,

        siswa_id INTEGER NOT NULL,

        jumlah_soal INTEGER DEFAULT 0,

        benar INTEGER DEFAULT 0,

        salah INTEGER DEFAULT 0,

        kosong INTEGER DEFAULT 0,

        nilai REAL DEFAULT 0,

        waktu_mulai DATETIME,

        waktu_selesai DATETIME DEFAULT CURRENT_TIMESTAMP,

        status TEXT DEFAULT 'selesai',

        UNIQUE(ujian_id, siswa_id),

        FOREIGN KEY(ujian_id)
        REFERENCES ujian(id),

        FOREIGN KEY(siswa_id)
        REFERENCES siswa(id)

    )
    `);

    // ==========================================
    // MONITOR UJIAN
    // ==========================================

    db.run("DROP TABLE IF EXISTS monitor_ujian");
    db.run(`
    CREATE TABLE IF NOT EXISTS monitor_ujian (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        ujian_id INTEGER NOT NULL,

        siswa_id INTEGER NOT NULL,

        status TEXT DEFAULT 'Belum Mulai',

        nomor_terakhir INTEGER DEFAULT 1,

        jumlah_dijawab INTEGER DEFAULT 0,

        waktu_mulai DATETIME,

        waktu_selesai DATETIME,

        sisa_waktu INTEGER DEFAULT 0,

        urutan_soal TEXT,

        refresh_count INTEGER DEFAULT 0,

tab_switch INTEGER DEFAULT 0,

fullscreen INTEGER DEFAULT 1,

        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE(ujian_id, siswa_id),

        FOREIGN KEY(ujian_id)
        REFERENCES ujian(id),

        FOREIGN KEY(siswa_id)
        REFERENCES siswa(id)

    )
    `);

    console.log("====================================");
    console.log("DATABASE BERHASIL DIINISIALISASI");
    console.log("====================================");

});

// ======================================
// UPDATE STRUKTUR DATABASE CBT V2
// ======================================

db.serialize(() => {

    const kolomBaru = [

        "ALTER TABLE monitor_ujian ADD COLUMN refresh_count INTEGER DEFAULT 0",

        "ALTER TABLE monitor_ujian ADD COLUMN tab_switch INTEGER DEFAULT 0",

        "ALTER TABLE monitor_ujian ADD COLUMN fullscreen INTEGER DEFAULT 1"

    ];

    kolomBaru.forEach(sql => {

        db.run(sql, (err) => {

            if (err && !err.message.includes("duplicate column")) {

                console.log(err.message);

            }

        });

    });

});