class RequiredValidator {

    static validate(data, fields) {

        const errors = [];

        fields.forEach(field => {

            if (
                data[field] === undefined ||
                data[field] === null ||
                data[field].toString().trim() === ""
            ) {

                errors.push(`${field} wajib diisi`);

            }

        });

        return errors;

    }

}

module.exports = RequiredValidator;