const hasilModel = require('../models/hasilModel');

exports.index = async (req, res) => {
    try {
        const hasil = await hasilModel.getAllHasil();
        res.render("hasil/index", { hasil });
    } catch (err) {
        console.error(err); // Tetap log di terminal
        res.send("Pesan Error: " + err.message); // Tampilkan ini di browser
    }
};