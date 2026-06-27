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

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "simujian_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 8
    }
}));

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

// ======================================
// ROUTES
// ======================================

const authRoutes = require("./backend/routes/authRoutes");
const dashboardRoutes = require("./backend/routes/dashboardRoutes");
const guruRoutes = require("./backend/routes/guruRoutes");

app.use("/", authRoutes);

app.use("/admin/dashboard", dashboardRoutes);

app.use("/guru", guruRoutes);

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