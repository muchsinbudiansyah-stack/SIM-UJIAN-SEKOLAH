const db = require("../config/database");

function findByUsername(username) {
    return new Promise((resolve, reject) => {

        console.log("=== LOGIN ===");
        console.log("Username yang dimasukkan:", username);

        db.get(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (err, row) => {

                if (err) {
                    console.error("SQL ERROR:", err);
                    reject(err);
                } else {
                    console.log("Hasil Query:", row);
                    resolve(row);
                }

            }
        );

    });
}

module.exports = {
    findByUsername
};