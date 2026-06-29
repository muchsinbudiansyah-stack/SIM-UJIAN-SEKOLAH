class BaseController {

    render(res, view, data = {}) {

        res.render(view, data);

    }

    redirect(res, url) {

        res.redirect(url);

    }

    success(res, url) {

        res.redirect(url);

    }

    error(res, error) {

        console.log(error);

        res.status(500).send("Terjadi kesalahan pada sistem.");

    }

}

module.exports = BaseController;