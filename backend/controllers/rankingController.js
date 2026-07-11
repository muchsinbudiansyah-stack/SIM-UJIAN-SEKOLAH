const rankingModel = require("../models/rankingModel");

// ======================================
// HALAMAN RANKING
// ======================================

exports.index = async (req, res) => {

    try {

        const ranking = await rankingModel.getRanking();

        res.render("admin/ranking/index", {

            user: req.session.user,

            ranking

        });

    } catch (err) {

        console.log(err);

        res.send(err.message);

    }

};