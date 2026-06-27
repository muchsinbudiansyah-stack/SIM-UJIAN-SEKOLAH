const bcrypt = require("bcrypt");
const db = require("../config/database");

const username = "admin";
const password = "admin123";

bcrypt.hash(password, 10, (err, hash) => {

    if (err) {
        console.log(err);
        return;
    }

    db.run(
        `INSERT INTO users(username,password,role)
         VALUES(?,?,?)`,
        [username, hash, "admin"],
        function(err){

            if(err){
                console.log("Gagal :", err.message);
                return;
            }

            console.log("=================================");
            console.log("ADMIN BERHASIL DIBUAT");
            console.log("Username :", username);
            console.log("Password :", password);
            console.log("=================================");

            process.exit();
        }
    );

});