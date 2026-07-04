const express=require("express");

const router=express.Router();

const peserta=require("../controllers/pesertaController");

router.get("/login",peserta.loginForm);

router.post("/login",peserta.login);

router.get("/dashboard",peserta.dashboard);

module.exports=router;