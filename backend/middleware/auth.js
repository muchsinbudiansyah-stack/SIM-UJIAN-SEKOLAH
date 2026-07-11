exports.isAuthenticated = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect("/");
    }

    next();

};

exports.isAdmin = (req, res, next) => {

    console.log("========== ADMIN SESSION ==========");
    console.log(req.session.user);
    console.log("===================================");

    if (!req.session.user) {
        return res.redirect("/");
    }

    if (req.session.user.role !== "admin") {
        return res.send("Akses ditolak.");
    }

    next();

};

exports.isSiswa = (req, res, next) => {

    console.log("=================================");
    console.log("SESSION SISWA");
    console.log(req.session.user);
    console.log("=================================");

    if (!req.session.user) {
        return res.redirect("/peserta/login");
    }

    if (req.session.user.role !== "siswa") {
        return res.send("Akses ditolak.");
    }

    next();

};