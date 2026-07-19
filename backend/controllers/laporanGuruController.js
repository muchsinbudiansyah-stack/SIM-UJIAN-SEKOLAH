const laporanGuruModel = require("../models/laporanGuruModel");
const hasilModel = require("../models/hasilModel");
const ExcelJS = require("exceljs");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");

exports.index = async (req,res)=>{

    try{

        const guru = await hasilModel.getGuruByNIP(
            req.session.user.username
        );

        const daftarUjian =
            await laporanGuruModel.getUjianGuru(guru.id);

        let hasil = [];

let statistik = {

    peserta:0,

    rataRata:0,

    tertinggi:0,

    terendah:0

};

if(req.query.ujian){

    hasil = await laporanGuruModel.getHasilByUjian(

        req.query.ujian

    );

    if(hasil.length>0){

        statistik.peserta = hasil.length;

        let total = 0;

        statistik.tertinggi = hasil[0].nilai;

        statistik.terendah = hasil[0].nilai;

        hasil.forEach(item=>{

            total += Number(item.nilai);

            if(item.nilai > statistik.tertinggi){

                statistik.tertinggi = item.nilai;

            }

            if(item.nilai < statistik.terendah){

                statistik.terendah = item.nilai;

            }

        });

        statistik.rataRata =

        (total/hasil.length).toFixed(2);

    }

}

        res.render("guru/laporan/index",{

    user:req.session.user,

    daftarUjian,

    hasil,

    statistik,

    ujianDipilih:req.query.ujian || ""

});

    }catch(err){

        console.log(err);

        res.send(err.message);

    }

};

exports.exportExcel = async (req,res)=>{

    try{

        const hasil = await laporanGuruModel.getHasilByUjian(

            req.params.ujianId

        );

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Laporan Nilai");

        sheet.columns=[

            {header:"No",key:"no",width:8},

            {header:"NISN",key:"nisn",width:20},

            {header:"Nama",key:"nama",width:30},

            {header:"Kelas",key:"kelas",width:15},

            {header:"Nilai",key:"nilai",width:12},

            {header:"Benar",key:"benar",width:12},

            {header:"Salah",key:"salah",width:12},

            {header:"Kosong",key:"kosong",width:12},

            {header:"Status",key:"status",width:15}

        ];

        hasil.forEach((item,index)=>{

            sheet.addRow({

                no:index+1,

                nisn:item.nisn,

                nama:item.nama,

                kelas:item.kelas,

                nilai:item.nilai,

                benar:item.benar,

                salah:item.salah,

                kosong:item.kosong,

                status:item.status

            });

        });

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            "attachment; filename=Laporan-Nilai.xlsx"

        );

        await workbook.xlsx.write(res);

        res.end();

    }catch(err){

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// PREVIEW CETAK LAPORAN
// ======================================

exports.printLaporan = async (req, res) => {

    try{

        const ujian = await laporanGuruModel.getUjianById(
            req.params.ujianId
        );

        if(!ujian){

            return res.send("Ujian tidak ditemukan.");

        }

        const hasil =
        await laporanGuruModel.getHasilByUjian(
            req.params.ujianId
        );

        res.render(

            "guru/laporan/print",

            {

                ujian,

                hasil

            }

        );

    }catch(err){

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// EXPORT PDF
// ======================================

exports.exportPDF = async (req, res) => {

    try {

        const ujian = await laporanGuruModel.getUjianById(
            req.params.ujianId
        );

        const hasil = await laporanGuruModel.getHasilByUjian(
            req.params.ujianId
        );

        const html = await ejs.renderFile(

            path.join(
                __dirname,
                "../../views/guru/laporan/print.ejs"
            ),

            {

                ujian,
                hasil

            }

        );

        const browser = await puppeteer.launch({

            headless: true,

            args: [

                "--no-sandbox",

                "--disable-setuid-sandbox"

            ]

        });

        const page = await browser.newPage();

        await page.setContent(html, {

            waitUntil: "networkidle0"

        });

        const pdf = await page.pdf({

            format: "A4",

            printBackground: true,

            margin: {

                top: "15mm",

                bottom: "15mm",

                left: "12mm",

                right: "12mm"

            }

        });

        await browser.close();

        res.setHeader(

            "Content-Type",

            "application/pdf"

        );

        res.setHeader(

            "Content-Disposition",

            "inline; filename=Laporan-Nilai.pdf"

        );

        res.send(pdf);

    }

    catch (err) {

        console.log(err);

        res.send(err.message);

    }

};

