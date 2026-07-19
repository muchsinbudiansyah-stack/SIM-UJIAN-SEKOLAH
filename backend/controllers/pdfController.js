const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable").default;

const laporanModel = require("../models/laporanModel");
const pdfService = require("../services/pdfService");

// ======================================
// EXPORT PDF
// ======================================

exports.export = async (req, res) => {

    try {

        const filter = {

    kelas : req.query.kelas || "",

    mapel : req.query.mapel || "",

    ujian : req.query.ujian || ""

};

const data = await laporanModel.getHasilFilter(filter);

        // =====================================
        // JUDUL
        // =====================================

        doc.setFontSize(15);

        doc.setFont("helvetica", "bold");

        doc.text(

            "LAPORAN HASIL UJIAN",

            148,

            46,

            {

                align:"center"

            }

        );

        // =====================================
        // INFO
        // =====================================

        doc.setFontSize(10);

        doc.setFont("helvetica","normal");

        doc.text(

            "Tanggal Cetak : " +

            new Date().toLocaleString("id-ID"),

            14,

            56

        );

        // =====================================
        // DATA TABEL
        // =====================================

        const rows = data.map((item,index)=>[

            index+1,

            item.nama,

            item.nisn,

            item.kelas,

            item.nama_mapel,

            item.nama_ujian,

            item.nilai

        ]);

        autoTable(doc,{

            startY:62,

            head:[[
                "No",
                "Nama",
                "NISN",
                "Kelas",
                "Mapel",
                "Ujian",
                "Nilai"
            ]],

            body:rows,

            theme:"grid",

            headStyles:{

                fillColor:[13,110,253],

                halign:"center"

            },

            styles:{

                fontSize:9,

                cellPadding:2

            },

            columnStyles:{

                0:{cellWidth:12},

                1:{cellWidth:55},

                2:{cellWidth:30},

                3:{cellWidth:22},

                4:{cellWidth:55},

                5:{cellWidth:65},

                6:{cellWidth:20,halign:"center"}

            }

        });

        // =====================================
        // FOOTER
        // =====================================

        const akhir = doc.lastAutoTable.finalY + 12;

        doc.text(

            "Jumlah Data : " +

            data.length,

            14,

            akhir

        );

        doc.text(

            "Dokumen dicetak otomatis oleh SIM-UJIAN SEKOLAH",

            148,

            200,

            {

                align:"center"

            }

        );

        pdfService.footer(doc);

        const pdf = doc.output();

        res.setHeader(

            "Content-Type",

            "application/pdf"

        );

        res.send(Buffer.from(pdf,"binary"));

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};