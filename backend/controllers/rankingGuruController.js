const hasilModel = require("../models/hasilModel");
const laporanGuruModel = require("../models/laporanGuruModel");
const ExcelJS = require("exceljs");

const ejs = require("ejs");

const path = require("path");

const puppeteer = require("puppeteer");

exports.index = async(req,res)=>{

    try{

        const guru = await hasilModel.getGuruByNIP(

            req.session.user.username

        );

        const daftarUjian =

        await laporanGuruModel.getUjianGuru(

            guru.id

        );

        let ranking=[];

        if(req.query.ujian){

            ranking=

            await laporanGuruModel.getRankingByUjian(

                req.query.ujian

            );

        }

        res.render(

            "guru/ranking/index",

            {

                user:req.session.user,

                daftarUjian,

                ranking,

                ujianDipilih:req.query.ujian||""

            }

        );

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// PRINT RANKING
// ======================================

exports.printRanking = async(req,res)=>{

    try{

        const ujian=

        await laporanGuruModel.getRankingHeader(

            req.params.ujianId

        );

        const ranking=

        await laporanGuruModel.getRankingByUjian(

            req.params.ujianId

        );

        res.render(

            "guru/ranking/print",

            {

                ujian,

                ranking

            }

        );

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// EXPORT EXCEL
// ======================================

exports.exportExcel = async(req,res)=>{

    try{

        const ranking=

        await laporanGuruModel.getRankingByUjian(

            req.params.ujianId

        );

        const workbook=new ExcelJS.Workbook();

        const sheet=workbook.addWorksheet("Ranking");

        sheet.columns=[

            {header:"Rank",key:"rank",width:10},

            {header:"Nama",key:"nama",width:35},

            {header:"NISN",key:"nisn",width:20},

            {header:"Kelas",key:"kelas",width:15},

            {header:"Nilai",key:"nilai",width:10}

        ];

        ranking.forEach((item,index)=>{

            sheet.addRow({

                rank:index+1,

                nama:item.nama,

                nisn:item.nisn,

                kelas:item.kelas,

                nilai:item.nilai

            });

        });

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            "attachment; filename=Ranking.xlsx"

        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};

// ======================================
// EXPORT PDF
// ======================================

exports.exportPDF = async(req,res)=>{

    try{

        const ujian=

        await laporanGuruModel.getRankingHeader(

            req.params.ujianId

        );

        const ranking=

        await laporanGuruModel.getRankingByUjian(

            req.params.ujianId

        );

        const html=

        await ejs.renderFile(

            path.join(

                __dirname,

                "../../views/guru/ranking/print.ejs"

            ),

            {

                ujian,

                ranking

            }

        );

        const browser=

        await puppeteer.launch({

            headless:true,

            args:[

                "--no-sandbox",

                "--disable-setuid-sandbox"

            ]

        });

        const page=

        await browser.newPage();

        await page.setContent(

            html,

            {

                waitUntil:"networkidle0"

            }

        );

        const pdf=

        await page.pdf({

            format:"A4",

            printBackground:true

        });

        await browser.close();

        res.contentType("application/pdf");

        res.send(pdf);

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};