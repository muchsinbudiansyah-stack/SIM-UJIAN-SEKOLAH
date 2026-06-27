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