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

exports.isGuru = (req, res, next) => {

    console.log("========== GURU SESSION ==========");
    console.log(req.session.user);
    console.log("==================================");

    if (!req.session.user) {
        return res.redirect("/");
    }

    if (req.session.user.role !== "guru") {
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
        return res.redirect("/");
    }

    if (req.session.user.role !== "siswa") {
        return res.send("Akses ditolak.");
    }

    next();

};

// ======================================
// GURU ATAU ADMIN
// ======================================

exports.isGuruOrAdmin = (req,res,next)=>{

    if(!req.session.user){

        return res.redirect("/");

    }

    if(

        req.session.user.role==="admin" ||

        req.session.user.role==="guru"

    ){

        return next();

    }

    return res.send("Akses ditolak.");

};