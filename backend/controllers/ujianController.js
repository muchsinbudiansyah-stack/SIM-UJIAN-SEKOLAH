const ujianModel = require("../models/ujianModel");
const siswaModel = require('../models/siswaModel');

// ======================================
// DAFTAR UJIAN
// ======================================
exports.index = async (req, res) => {

    try {

        let ujian = [];
        let mapel = [];
        let selectedMapel = req.query.mapel || "";

        // ==========================
        // ADMIN
        // ==========================
        if (req.session.user.role === "admin") {

            ujian = await ujianModel.getAll();

        }

        // ==========================
        // GURU
        // ==========================
        else {

            const guru =
                await ujianModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guru) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            // semua mapel guru
            mapel =
                await ujianModel.getMapelGuru(
                    guru.id
                );

            // jika belum memilih mapel
            if (
                !selectedMapel &&
                mapel.length > 0
            ) {

                selectedMapel =
                    mapel[0].id;

            }

            // ambil ujian sesuai guru & mapel
            ujian =
                await ujianModel.getByGuruMapel(

                    guru.id,

                    selectedMapel

                );

        }

        res.render("ujian/index", {

            ujian,

            mapel,

            selectedMapel,

            role: req.session.user.role

        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM TAMBAH UJIAN
// ======================================
exports.tambah = async (req, res) => {

    try {

        let mapel = [];
        let guru = [];
        const kelas = await ujianModel.getKelas();

        // ==========================
        // ADMIN
        // ==========================
        if (req.session.user.role === "admin") {

            mapel = await ujianModel.getMapel();
            guru = await ujianModel.getGuru();

        }

        // ==========================
        // GURU
        // ==========================
        else {

            const dataGuru =
                await ujianModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!dataGuru) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            guru = [dataGuru];

            mapel =
                await ujianModel.getMapelGuru(
                    dataGuru.id
                );

        }

        res.render("ujian/tambah", {

            mapel,

            kelas,

            guru,

            role: req.session.user.role

        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// DAFTAR PESERTA UJIAN
// ======================================
exports.listPeserta = async (req, res) => {
    try {
        const ujianId = req.params.id;

        // Ambil data ujian & daftar siswa
        const ujian = await ujianModel.findById(ujianId);
        const peserta = await siswaModel.getByKelas(ujian.kelas_id);

        res.render("ujian/peserta", {
            ujian,
            peserta
        });
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};

// ======================================
// SIMPAN UJIAN
// ======================================
exports.simpan = async (req, res) => {

    try {

        let guru_id = req.body.guru_id;

        // ==========================
        // JIKA LOGIN GURU
        // guru_id otomatis dari akun login
        // ==========================
        if (req.session.user.role === "guru") {

            const guru =
                await ujianModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guru) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            guru_id = guru.id;

            // pastikan mapel memang diampu guru
            const boleh =
                await ujianModel.isGuruMengajarMapel(

                    guru.id,

                    req.body.mapel_id

                );

            if (!boleh) {

                return res.send(
                    "Anda tidak memiliki hak menggunakan mata pelajaran tersebut."
                );

            }

        }

        await ujianModel.create({

            nama_ujian: req.body.nama_ujian,

            mapel_id: req.body.mapel_id,

            kelas_id: req.body.kelas_id,

            guru_id: guru_id,

            tanggal: req.body.tanggal,

            jam_mulai: req.body.jam_mulai,

            jam_selesai: req.body.jam_selesai,

            durasi: req.body.durasi,

            jumlah_soal: req.body.jumlah_soal,

            acak_soal: req.body.acak_soal ? 1 : 0,

            acak_jawaban: req.body.acak_jawaban ? 1 : 0,

            token: req.body.token,

            status: 1

        });

        res.redirect("/ujian");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// FORM EDIT UJIAN
// ======================================
exports.edit = async (req, res) => {

    try {

        const ujian =
            await ujianModel.findById(
                req.params.id
            );

        if (!ujian) {

            return res.send(
                "Data ujian tidak ditemukan."
            );

        }

        let mapel = [];
        let guru = [];
        const kelas =
            await ujianModel.getKelas();

        // ==========================
        // ADMIN
        // ==========================
        if (req.session.user.role === "admin") {

            mapel =
                await ujianModel.getMapel();

            guru =
                await ujianModel.getGuru();

        }

        // ==========================
        // GURU
        // ==========================
        else {

            const dataGuru =
                await ujianModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!dataGuru) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            // Guru hanya boleh mengedit
            // ujian miliknya sendiri
            if (
                Number(ujian.guru_id) !==
                Number(dataGuru.id)
            ) {

                return res.send(
                    "Anda tidak memiliki akses ke ujian ini."
                );

            }

            guru = [dataGuru];

            mapel =
                await ujianModel.getMapelGuru(
                    dataGuru.id
                );

        }

        res.render(

            "ujian/edit",

            {

                ujian,

                mapel,

                kelas,

                guru,

                role: req.session.user.role

            }

        );

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// UPDATE UJIAN
// ======================================
exports.update = async (req, res) => {

    try {

        let guru_id = req.body.guru_id;

        // ==========================
        // LOGIN GURU
        // ==========================
        if (req.session.user.role === "guru") {

            const guru =
                await ujianModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guru) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            const ujian =
                await ujianModel.findById(
                    req.params.id
                );

            if (!ujian) {

                return res.send(
                    "Data ujian tidak ditemukan."
                );

            }

            // Guru hanya boleh mengubah
            // ujian miliknya sendiri
            if (
                Number(ujian.guru_id) !==
                Number(guru.id)
            ) {

                return res.send(
                    "Anda tidak memiliki akses untuk mengubah ujian ini."
                );

            }

            // Guru tidak boleh mengubah
            // guru_id melalui form
            guru_id = guru.id;

            // Validasi mapel
            const boleh =
                await ujianModel.isGuruMengajarMapel(

                    guru.id,

                    req.body.mapel_id

                );

            if (!boleh) {

                return res.send(
                    "Anda tidak berhak menggunakan mata pelajaran tersebut."
                );

            }

        }

        await ujianModel.update(

            req.params.id,

            {

                nama_ujian: req.body.nama_ujian,

                mapel_id: req.body.mapel_id,

                kelas_id: req.body.kelas_id,

                guru_id: guru_id,

                tanggal: req.body.tanggal,

                jam_mulai: req.body.jam_mulai,

                jam_selesai: req.body.jam_selesai,

                durasi: req.body.durasi,

                jumlah_soal: req.body.jumlah_soal,

                acak_soal:
                    req.body.acak_soal ? 1 : 0,

                acak_jawaban:
                    req.body.acak_jawaban ? 1 : 0,

                token: req.body.token,

                status:
                    req.body.status ? 1 : 0

            }

        );

        res.redirect("/ujian");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// HAPUS UJIAN
// ======================================
exports.hapus = async (req, res) => {

    try {

        // ==========================
        // LOGIN GURU
        // ==========================
        if (req.session.user.role === "guru") {

            const guru =
                await ujianModel.getGuruByNIP(
                    req.session.user.username
                );

            if (!guru) {

                return res.send(
                    "Data guru tidak ditemukan."
                );

            }

            const ujian =
                await ujianModel.findById(
                    req.params.id
                );

            if (!ujian) {

                return res.send(
                    "Data ujian tidak ditemukan."
                );

            }

            // Guru hanya boleh menghapus
            // ujian miliknya sendiri
            if (
                Number(ujian.guru_id) !==
                Number(guru.id)
            ) {

                return res.send(
                    "Anda tidak memiliki hak menghapus ujian ini."
                );

            }

        }

        await ujianModel.delete(
            req.params.id
        );

        res.redirect("/ujian");

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};