const db = require("../config/database");

class BaseModel {

    constructor(tableName) {
        this.tableName = tableName;
    }

    getAll(orderBy = "id") {

        return new Promise((resolve, reject) => {

            db.all(
                `SELECT * FROM ${this.tableName} ORDER BY ${orderBy}`,
                [],
                (err, rows) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }

                }

            );

        });

    }

    findById(id) {

        return new Promise((resolve, reject) => {

            db.get(
                `SELECT * FROM ${this.tableName} WHERE id = ?`,
                [id],
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

    delete(id) {

        return new Promise((resolve, reject) => {

            db.run(
                `DELETE FROM ${this.tableName} WHERE id = ?`,
                [id],
                function(err) {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes);
                    }

                }

            );

        });

    }

    count() {

        return new Promise((resolve, reject) => {

            db.get(
                `SELECT COUNT(*) AS total FROM ${this.tableName}`,
                [],
                (err, row) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(row.total);
                    }

                }

            );

        });

    }

}

module.exports = BaseModel;