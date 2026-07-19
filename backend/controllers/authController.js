const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

exports.showLogin = (req, res) => {

    if (req.session.user) {
        return res.redirect("/admin/dashboard");
    }

    res.render("login/index");
};

exports.login = async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await userModel.findByUsername(username);

        console.log("DATA USER :", user);

        if (!user) {
            return res.send("Username tidak ditemukan.");
        }

        const cocok = await bcrypt.compare(password, user.password);

        if (!cocok) {
            return res.send("Password salah.");
        }

        req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role
};

console.log("ROLE =", user.role);
console.log("TYPE =", typeof user.role);

// Redirect sesuai role
switch (user.role) {

    case "admin":
        return res.redirect("/admin/dashboard");

    case "guru":
        return res.redirect("/guru/dashboard");

    case "siswa":
        return res.redirect("/siswa/dashboard");

    default:
        console.log("ROLE TIDAK DIKENALI:", user.role);
        req.session.destroy(() => {});
        return res.send("Role tidak dikenali.");

}

        res.redirect("/admin/dashboard");

    } catch (err) {

        console.error(err);

        res.send("Terjadi kesalahan.");

    }

};

exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

};