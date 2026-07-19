const bcrypt = require("bcrypt");

const pesertaModel = require("../models/pesertaModel");

exports.loginForm=(req,res)=>{

    res.render("siswa/login");

};

exports.login=async(req,res)=>{

    try{

        const {nisn,password}=req.body;

        const siswa=await pesertaModel.login(nisn);

        if(!siswa){

            return res.send("NISN tidak ditemukan");

        }

        const cocok=await bcrypt.compare(password,siswa.password);

        if(!cocok){

            return res.send("Password salah");

        }

        req.session.user={

            id:siswa.id,

            role:"siswa",

            siswa_id:siswa.siswa_id,

            nama:siswa.nama,

            kelas_id:siswa.kelas_id

        };

        res.redirect("/peserta/dashboard");

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};

exports.dashboard=async(req,res)=>{

    const ujian=

    await pesertaModel.getDaftarUjian(

        req.session.user.kelas_id

    );

    res.render(

        "siswa/dashboard",

        {

            siswa:req.session.user,

            ujian

        }

    );

};

// ======================================
// MULAI UJIAN
// ======================================

exports.mulaiUjian = async (req, res) => {

    try {

        // ======================================
        // AMBIL DATA UJIAN
        // ======================================

        const ujian = await pesertaModel.getUjianById(req.params.id);

        if (!ujian) {

            return res.send("Ujian tidak ditemukan");

        }

        // ======================================
        // CEK MONITOR
        // ======================================

        const monitor = await pesertaModel.getMonitor(

            ujian.id,

            req.session.user.siswa_id

        );

        // ======================================
        // RESUME NOMOR SOAL
        // ======================================

        let nomor = parseInt(req.query.no);

        if (!nomor) {

            if (monitor && monitor.nomor_terakhir > 0) {

                nomor = monitor.nomor_terakhir;

            } else {

                nomor = 1;

            }

        }

        // ======================================
        // AMBIL URUTAN SOAL
        // ======================================

        let urutanSoal = await pesertaModel.getUrutanSoal(

            ujian.id,

            req.session.user.siswa_id

        );

        // ======================================
        // BELUM ADA URUTAN SOAL
        // ======================================

        if (!urutanSoal) {

            let semuaSoal =
    await pesertaModel.getSemuaSoal(
        ujian.mapel_id
    );

// Acak soal bila diaktifkan
if (ujian.acak_soal == 1) {

    semuaSoal.sort(() => Math.random() - 0.5);

}

// Ambil sesuai jumlah soal ujian
semuaSoal =
    semuaSoal.slice(
        0,
        ujian.jumlah_soal
    );

const daftarId =
    semuaSoal.map(
        s => s.id
    );

            await pesertaModel.simpanUrutanSoal(

                ujian.id,

                req.session.user.siswa_id,

                daftarId

            );

            urutanSoal = daftarId;

        }

        // ======================================
        // AMBIL SOAL SESUAI URUTAN
        // ======================================

        const soalId = urutanSoal[nomor - 1];

        const soal =
    await pesertaModel.getSoalById(
        soalId,
        ujian.mapel_id
    );

        if (!soal) {

            return res.send("Soal tidak ditemukan");

        }

        // ======================================
        // JAWABAN SISWA
        // ======================================

        const jawaban = await pesertaModel.getJawaban(

            ujian.id,

            req.session.user.siswa_id,

            soal.id

        );

        const semuaJawaban = await pesertaModel.getSemuaJawaban(

            ujian.id,

            req.session.user.siswa_id

        );

        const jumlahDijawab = await pesertaModel.hitungJawaban(

            ujian.id,

            req.session.user.siswa_id

        );

        // ======================================
// MONITOR UJIAN
// ======================================

await pesertaModel.mulaiMonitor({

    ujian_id: ujian.id,

    siswa_id: req.session.user.siswa_id,

    sisa_waktu: ujian.durasi * 60

});

// ======================================
// CEK SISA WAKTU
// ======================================

const dataTimer = await pesertaModel.getSisaWaktu(

    ujian.id,

    req.session.user.siswa_id

);

const sisaWaktu =

    dataTimer && dataTimer.sisa_waktu > 0

        ? dataTimer.sisa_waktu

        : ujian.durasi * 60;

        await pesertaModel.updateMonitor({

            ujian_id: ujian.id,

            siswa_id: req.session.user.siswa_id,

            nomor_terakhir: nomor,

            jumlah_dijawab: jumlahDijawab

        });

        // ======================================
        // TAMPILKAN SOAL
        // ======================================

        res.render(

            "siswa/ujian",

            {

                ujian,

                soal,

                nomor,

                total: ujian.jumlah_soal,

                siswa: req.session.user,

                jawaban,

                semuaJawaban,

                urutanSoal,

sisaWaktu

            }

        );

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// SELESAI UJIAN
// ======================================

exports.selesaiUjian = async (req, res) => {

    try {

        const ujian = await pesertaModel.getUjianById(req.params.id);

        const daftarJawaban = await pesertaModel.getJawabanDanKunci(
            ujian.id,
            req.session.user.siswa_id
        );

        let benar = 0;
        let salah = 0;

        daftarJawaban.forEach(item => {

            if (item.jawaban === item.kunci) {
                benar++;
            } else {
                salah++;
            }

        });

        const jumlahSoal = ujian.jumlah_soal;
        const kosong = jumlahSoal - daftarJawaban.length;

        const nilai = Number(
            ((benar / jumlahSoal) * 100).toFixed(2)
        );

        await pesertaModel.simpanHasil({

            ujian_id: ujian.id,
            siswa_id: req.session.user.siswa_id,
            jumlah_soal: jumlahSoal,
            benar,
            salah,
            kosong,
            nilai

        });

        // ======================================
// UPDATE STATUS MONITOR
// ======================================

await pesertaModel.selesaiMonitor(

    ujian.id,

    req.session.user.siswa_id

);

        delete req.session.urutanSoal;

        res.render("siswa/hasil", {

            siswa: req.session.user,
            ujian,
            benar,
            salah,
            kosong,
            nilai

        });

    } catch (err) {

        console.log(err);
        res.send(err.message);

    }

};

// ======================================
// AUTO SAVE JAWABAN
// ======================================

exports.simpanJawaban = async (req, res) => {

    try {

        await pesertaModel.simpanJawaban({

            ujian_id: req.body.ujian_id,
            siswa_id: req.session.user.siswa_id,
            soal_id: req.body.soal_id,
            jawaban: req.body.jawaban

        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ======================================
// UPDATE TIMER
// ======================================

exports.updateTimer = async (req, res) => {

    try {

        await pesertaModel.updateSisaWaktu(

            req.body.ujian_id,

            req.session.user.siswa_id,

            req.body.sisa_waktu

        );

        res.json({

            success: true

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false

        });

    }

};

// ======================================
// HEARTBEAT
// ======================================

exports.heartbeat = async (req, res) => {

    try {

        await pesertaModel.heartbeat(

            req.body.ujian_id,

            req.session.user.siswa_id

        );

        res.json({

            success: true

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false

        });

    }

};

// ======================================
// UPDATE MONITOR
// ======================================

exports.updateMonitorRealtime = async (req, res) => {

    try {

        const jumlahDijawab = await pesertaModel.hitungJawaban(

            req.body.ujian_id,

            req.session.user.siswa_id

        );

        await pesertaModel.updateMonitor({

            ujian_id: req.body.ujian_id,

            siswa_id: req.session.user.siswa_id,

            nomor_terakhir: req.body.nomor,

            jumlah_dijawab: jumlahDijawab

        });

        res.json({

            success: true

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false

        });

    }

};