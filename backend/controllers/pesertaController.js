const bcrypt = require("bcrypt");

const pesertaModel = require("../models/pesertaModel");

exports.loginForm=(req,res)=>{

    res.render("siswa/login");

};

exports.login=async(req,res)=>{

    try{

        const {nisn,password}=req.body;

        const siswa=await pesertaModel.login(nisn);

        if(!siswa){

            return res.send("NISN tidak ditemukan");

        }

        const cocok=await bcrypt.compare(password,siswa.password);

        if(!cocok){

            return res.send("Password salah");

        }

        req.session.user={

            id:siswa.id,

            role:"siswa",

            siswa_id:siswa.siswa_id,

            nama:siswa.nama,

            kelas_id:siswa.kelas_id

        };

        res.redirect("/peserta/dashboard");

    }

    catch(err){

        console.log(err);

        res.send(err.message);

    }

};

exports.dashboard=async(req,res)=>{

    const ujian=

    await pesertaModel.getDaftarUjian(

        req.session.user.kelas_id

    );

    res.render(

        "siswa/dashboard",

        {

            siswa:req.session.user,

            ujian

        }

    );

};