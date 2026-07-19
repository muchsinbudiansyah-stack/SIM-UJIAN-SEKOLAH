const school = require("../helpers/schoolHelper");

exports.header = function(doc){

    doc.setFont("helvetica","bold");

    doc.setFontSize(17);

    doc.text(

        school.nama,

        148,

        15,

        {

            align:"center"

        }

    );

    doc.setFontSize(10);

    doc.setFont("helvetica","normal");

    doc.text(

        school.alamat,

        148,

        21,

        {

            align:"center"

        }

    );

    doc.text(

        school.kabupaten,

        148,

        26,

        {

            align:"center"

        }

    );

    doc.text(

        "Email : "+school.email,

        148,

        31,

        {

            align:"center"

        }

    );

    doc.setLineWidth(.5);

    doc.line(

        10,

        36,

        287,

        36

    );

};

exports.footer = function(doc){

    const totalHalaman = doc.getNumberOfPages();

    for(let i=1;i<=totalHalaman;i++){

        doc.setPage(i);

        doc.setFontSize(9);

        doc.setFont("helvetica","italic");

        doc.text(

            "Dicetak oleh SIM-UJIAN SEKOLAH",

            10,

            205

        );

        doc.text(

            "Halaman " + i + " / " + totalHalaman,

            287,

            205,

            {

                align:"right"

            }

        );

    }

};