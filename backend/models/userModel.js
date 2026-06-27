const db = require("../config/database");

function findByUsername(username) {
    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (err, row) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }

            }
        );

    });
}

module.exports = {
    findByUsername
};