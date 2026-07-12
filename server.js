require("dotenv").config();

require("./backend/config/initDatabase");

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const app = express();

// ======================================
// MIDDLEWARE
// ======================================

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "simujian_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 8
        }
    })
);

// ======================================
// VIEW ENGINE
// ======================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ======================================
// STATIC FILE
// ======================================

app.use(
    "/assets",
    express.static(path.join(__dirname, "frontend/assets"))
);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ======================================
// ROUTES
// ======================================

const authRoutes = require("./backend/routes/authRoutes");
const dashboardRoutes = require("./backend/routes/dashboardRoutes");
const guruRoutes = require("./backend/routes/guruRoutes");
const kelasRoutes = require("./backend/routes/kelasRoutes");
const mapelRoutes = require("./backend/routes/mapelRoutes");
const siswaRoutes = require("./backend/routes/siswaRoutes");
const bankSoalRoutes = require("./backend/routes/bankSoalRoutes");
const ujianRoutes = require("./backend/routes/ujianRoutes");
const uploadRoutes = require("./backend/routes/uploadRoutes");
const hasilRoutes = require('./backend/routes/hasilRoutes');
const pesertaRoutes=require("./backend/routes/pesertaRoutes");
const monitorRoutes = require("./backend/routes/monitorRoutes");
const rankingRoutes = require("./backend/routes/rankingRoutes");
const analisisRoutes = require("./backend/routes/analisisRoutes");
const laporanRoutes = require("./backend/routes/laporanRoutes");

app.use("/", authRoutes);

app.use("/admin/dashboard", dashboardRoutes);

app.use("/guru", guruRoutes);

app.use("/kelas", kelasRoutes);

app.use("/mapel", mapelRoutes);

app.use("/siswa", siswaRoutes);

app.use("/bank-soal", bankSoalRoutes);

app.use("/ujian", ujianRoutes);

app.use("/upload", uploadRoutes);

app.use('/hasil', hasilRoutes);

app.use("/peserta",pesertaRoutes);

app.use("/monitor", monitorRoutes);

app.use("/ranking", rankingRoutes);

app.use("/analisis", analisisRoutes);

app.use("/laporan", laporanRoutes);
// ======================================
// SERVER
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("====================================");
    console.log(" SIM-UJIAN SEKOLAH");
    console.log("====================================");
    console.log("Server berjalan");
    console.log("http://localhost:" + PORT);

});