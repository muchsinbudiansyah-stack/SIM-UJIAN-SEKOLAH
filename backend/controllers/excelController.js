const ExcelJS = require("exceljs");

const laporanModel = require("../models/laporanModel");

// ======================================
// EXPORT EXCEL
// ======================================

exports.export = async (req,res)=>{

    try{

        const filter={

            kelas:req.query.kelas || "",

            mapel:req.query.mapel || "",

            ujian:req.query.ujian || ""

        };

        const data=

            await laporanModel.getHasilFilter(filter);

        const workbook=new ExcelJS.Workbook();

        const sheet=workbook.addWorksheet("Laporan");

        // ======================================
        // HEADER
        // ======================================

        sheet.mergeCells("A1:G1");

        sheet.getCell("A1").value=

            "SMA NEGERI 1 TELUK BELENGKONG";

        sheet.getCell("A1").font={

            bold:true,

            size:16

        };

        sheet.getCell("A1").alignment={

            horizontal:"center"

        };

        sheet.mergeCells("A2:G2");

        sheet.getCell("A2").value=

            "LAPORAN HASIL UJIAN";

        sheet.getCell("A2").font={

            bold:true,

            size:13

        };

        sheet.getCell("A2").alignment={

            horizontal:"center"

        };

        sheet.addRow([]);

        sheet.addRow([
    "Kelas",
    filter.kelas || "Semua"
]);

sheet.addRow([
    "Mata Pelajaran",
    filter.mapel || "Semua"
]);

sheet.addRow([
    "Ujian",
    filter.ujian || "Semua"
]);

sheet.addRow([
    "Tanggal Cetak",
    new Date().toLocaleString("id-ID")
]);

sheet.addRow([]);

        // ======================================
        // HEADER TABEL
        // ======================================

        sheet.addRow([

            "No",

            "Nama",

            "NISN",

            "Kelas",

            "Mapel",

            "Ujian",

            "Nilai"

        ]);

        const header=sheet.getRow(9);

        header.font={

            bold:true,

            color:{argb:"FFFFFFFF"}

        };

        header.fill={

            type:"pattern",

            pattern:"solid",

            fgColor:{argb:"0D6EFD"}

        };

        header.alignment={

            horizontal:"center"

        };

        // ======================================
        // DATA
        // ======================================

        data.forEach((item,index)=>{

            sheet.addRow([

                index+1,

                item.nama,

                item.nisn,

                item.kelas,

                item.nama_mapel,

                item.nama_ujian,

                item.nilai

            ]);

        });

        // ======================================
        // BORDER
        // ======================================

        sheet.eachRow((row)=>{

            row.eachCell((cell)=>{

                cell.border={

                    top:{style:"thin"},

                    left:{style:"thin"},

                    bottom:{style:"thin"},

                    right:{style:"thin"}

                };

            });

        });

        // ======================================
        // LEBAR KOLOM
        // ======================================

        sheet.columns=[

            {width:8},

            {width:30},

            {width:18},

            {width:12},

            {width:30},

            {width:28},

            {width:12}

        ];

        sheet.views = [
    {
        state: "frozen",
        ySplit: 9
    }
];

sheet.autoFilter = {
    from: "A9",
    to: "G9"
};

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            'attachment; filename="Laporan_Hasil_Ujian.xlsx"'

        );

        sheet.pageSetup = {

    orientation: "landscape",

    fitToPage: true,

    fitToWidth: 1,

    fitToHeight: 0,

    margins: {

        left: 0.3,

        right: 0.3,

        top: 0.5,

        bottom: 0.5,

        header: 0.3,

        footer: 0.3

    }

};

        await workbook.xlsx.write(res);

        res.end();

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};