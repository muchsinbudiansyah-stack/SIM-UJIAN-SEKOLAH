const express = require("express");
const router = express.Router();

const peserta = require("../controllers/pesertaController");
const auth = require("../middleware/auth");

router.get("/login", peserta.loginForm);

router.post("/login", peserta.login);

router.get(
    "/dashboard",
    auth.isSiswa,
    peserta.dashboard
);

router.get(

    "/ujian/:id",

    auth.isSiswa,

    peserta.mulaiUjian

);

// ======================================
// AUTO SAVE JAWABAN
// ======================================

router.post(

    "/simpan-jawaban",

    auth.isSiswa,

    peserta.simpanJawaban

);

router.post(

    "/update-timer",

    auth.isSiswa,

    peserta.updateTimer

);

router.post(

    "/heartbeat",

    auth.isSiswa,

    peserta.heartbeat

);

router.post(
    "/ujian/:id/selesai",
    auth.isSiswa,
    peserta.selesaiUjian
);

router.post(

    "/auto-submit/:id",

    auth.isSiswa,

    peserta.selesaiUjian

);

router.post(

    "/update-monitor",

    auth.isSiswa,

    peserta.updateMonitorRealtime

);

router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/peserta/login");

    });

});

module.exports = router;