// ======================================================
// SIM UJIAN SEKOLAH
// CBT ENGINE V2
// ======================================================

"use strict";

// ======================================================
// GLOBAL
// ======================================================

const timerElement = document.getElementById("timer");
const formUjian = document.getElementById("formUjian");

const pilihanJawaban =
    document.querySelectorAll("input[name='jawaban']");

    const jawabanEssay =
    document.getElementById("jawabanEssay");

const ujian_id = window.CBT.ujian_id;
const soal_id = window.CBT.soal_id;

let nomor = window.CBT.nomor;

let sisaWaktu = Number(window.CBT.sisaWaktu);

let timerInterval = null;
let heartbeatInterval = null;
let timerSyncInterval = null;

let submitSedangBerjalan = false;
let sedangMenyimpan = false;

// ======================================================
// FORMAT JAM
// ======================================================

function formatWaktu(totalDetik){

    const jam = Math.floor(totalDetik / 3600);

    const menit = Math.floor(
        (totalDetik % 3600) / 60
    );

    const detik = totalDetik % 60;

    return (
        String(jam).padStart(2,"0")
        + ":"
        + String(menit).padStart(2,"0")
        + ":"
        + String(detik).padStart(2,"0")
    );

}

// ======================================================
// RENDER TIMER
// ======================================================

function renderTimer(){

    timerElement.textContent =
        formatWaktu(sisaWaktu);

}

renderTimer();

// ======================================================
// UPDATE TIMER KE SERVER
// ======================================================

async function updateTimerServer(){

    try{

        await fetch("/peserta/update-timer",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                ujian_id,

                sisa_waktu:sisaWaktu

            })

        });

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// HEARTBEAT
// ======================================================

async function heartbeat(){

    try{

        await fetch("/peserta/heartbeat",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                ujian_id

            })

        });

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// UPDATE MONITOR
// ======================================================

async function updateMonitor(){

    try{

        await fetch("/peserta/update-monitor",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                ujian_id,

                nomor

            })

        });

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// AUTO SAVE JAWABAN
// ======================================================

async function simpanJawaban(jawaban){

    if(sedangMenyimpan){

        return;

    }

    sedangMenyimpan = true;

    try{

        const response = await fetch(

            "/peserta/simpan-jawaban",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    ujian_id,

                    soal_id,

                    jawaban

                })

            }

        );

        const hasil = await response.json();

        if(!hasil.success){

            console.log("Gagal menyimpan jawaban");

        }

        await updateMonitor();

    }

    catch(err){

        console.log(err);

    }

    finally{

        sedangMenyimpan = false;

    }

}

// ======================================================
// AUTO SUBMIT
// ======================================================

function autoSubmit(){

    if(submitSedangBerjalan){

        return;

    }

    submitSedangBerjalan = true;

    clearInterval(timerInterval);

    clearInterval(timerSyncInterval);

    clearInterval(heartbeatInterval);

    alert("Waktu ujian telah habis.\nJawaban akan dikirim otomatis.");

    formUjian.submit();

}

// ======================================================
// ENGINE TIMER
// ======================================================

function mulaiTimer(){

    if(timerInterval){

        clearInterval(timerInterval);

    }

    timerInterval = setInterval(()=>{

        if(sisaWaktu <= 0){

            autoSubmit();

            return;

        }

        sisaWaktu--;

        renderTimer();

    },1000);

}

mulaiTimer();

// ======================================================
// SYNC TIMER
// ======================================================

timerSyncInterval = setInterval(()=>{

    updateTimerServer();

},15000);

// ======================================================
// HEARTBEAT
// ======================================================

heartbeatInterval = setInterval(()=>{

    heartbeat();

},10000);

// ======================================================
// EVENT PILIHAN JAWABAN (PG)
// ======================================================

pilihanJawaban.forEach((radio) => {

    radio.addEventListener("change", async function () {

        document.querySelectorAll(".opsi").forEach(item => {

            item.style.background = "";
            item.style.border = "2px solid #ddd";

        });

        this.parentElement.style.background = "#d1e7dd";
        this.parentElement.style.border = "2px solid #198754";

        await simpanJawaban(this.value);

        const aktif = document.querySelector(".nomor-item.active");

        if (aktif) {

            aktif.classList.remove("active");
            aktif.classList.add("answered");

        }

    });

});


// ======================================================
// AUTO SAVE ESSAY
// ======================================================

if (jawabanEssay) {

    console.log("TEXTAREA DITEMUKAN");

    let timerEssay;

    jawabanEssay.addEventListener("input", function () {

        console.log("MENGETIK :", this.value);

        clearTimeout(timerEssay);

        timerEssay = setTimeout(async () => {

            console.log("DIKIRIM :", this.value);

            await simpanJawaban(this.value);

            const aktif = document.querySelector(".nomor-item.active");

            if (aktif) {

                aktif.classList.remove("active");
                aktif.classList.add("answered");

            }

        }, 800);

    });

}

// ======================================================
// JIKA SUDAH ADA JAWABAN
// ======================================================

document.addEventListener("DOMContentLoaded",()=>{

    const checked = document.querySelector(
    "input[name='jawaban']:checked"
);

if (checked) {

    checked.parentElement.style.background = "#d1e7dd";
    checked.parentElement.style.border = "2px solid #198754";

}

if (jawabanEssay && jawabanEssay.value.trim() !== "") {

    const aktif = document.querySelector(".nomor-item.active");

    if (aktif) {

        aktif.classList.remove("active");
        aktif.classList.add("answered");

    }

}

});

// ======================================================
// SUBMIT MANUAL
// ======================================================

formUjian.addEventListener("submit",()=>{

    submitSedangBerjalan=true;

    clearInterval(timerInterval);
    clearInterval(timerSyncInterval);
    clearInterval(heartbeatInterval);

});

// ======================================================
// KELUAR HALAMAN
// ======================================================

window.addEventListener("beforeunload",()=>{

    updateTimerServer();

    heartbeat();

});

// ======================================================
// PAGE HIDE
// ======================================================

window.addEventListener("pagehide",()=>{

    clearInterval(timerInterval);
    clearInterval(timerSyncInterval);
    clearInterval(heartbeatInterval);

});

// ======================================================
// DEBUG
// ======================================================

console.log("=================================");
console.log("SIM UJIAN SEKOLAH");
console.log("CBT ENGINE V2");
console.log("Resume Timer : OK");
console.log("Heartbeat    : OK");
console.log("Auto Save    : OK");
console.log("Monitoring   : OK");
console.log("=================================");