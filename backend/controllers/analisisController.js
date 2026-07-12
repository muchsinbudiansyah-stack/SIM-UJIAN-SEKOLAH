const analisisModel = require("../models/analisisModel");

exports.index = async (req,res)=>{

    try{

        const summary =
    await analisisModel.getSummary();

const data =
    await analisisModel.getNilai();

const distribusi =
    await analisisModel.getDistribusi();

const top10 =
    await analisisModel.getTop10();

    const kelulusan =
    await analisisModel.getKelulusan();

    const semuaNilai =
    await analisisModel.getSemuaNilai();

// ======================================
// STATISTIK LANJUTAN
// ======================================

const nilai = semuaNilai.map(n => Number(n.nilai));

let median = 0;
let rentang = 0;
let standarDeviasi = 0;

if (nilai.length > 0) {

    // Median
    const tengah = Math.floor(nilai.length / 2);

    if (nilai.length % 2 === 0) {

        median =
            (nilai[tengah - 1] + nilai[tengah]) / 2;

    } else {

        median = nilai[tengah];

    }

    // Rentang
    rentang =
        Math.max(...nilai) - Math.min(...nilai);

    // Standar Deviasi
    const rata =
        nilai.reduce((a,b)=>a+b,0) / nilai.length;

    const varians =
        nilai.reduce((a,b)=>{

            return a + Math.pow(b-rata,2);

        },0) / nilai.length;

    standarDeviasi =
        Math.sqrt(varians).toFixed(2);

}

res.render(

    "admin/analisis/index",

    {

        user:req.session.user,

        summary,

        data,

        distribusi,

        top10,

        kelulusan,

        median,

        rentang,

        standarDeviasi

    }

);

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};