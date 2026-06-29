function parseWord(text) {

    // Normalisasi line ending
    text = text.replace(/\r/g, "");

    const hasil = [];

    let soal = null;

    function simpanSoal() {

        if (!soal) return;

        // Rapikan pertanyaan
        soal.pertanyaan = soal.pertanyaan.trim();

        hasil.push(soal);

    }

    function soalBaru() {

        simpanSoal();

        soal = {

            jenis: "PG",

            pertanyaan: "",

            gambar: "",

            audio: "",

            video: "",

            pilihan_a: "",
            pilihan_b: "",
            pilihan_c: "",
            pilihan_d: "",
            pilihan_e: "",

            jawaban: "",

            bobot: 1

        };

    }

    const baris = text.split("\n");

    for (let i = 0; i < baris.length; i++) {

        let item = baris[i].trim();

        if (item === "") continue;

        const upper = item.toUpperCase();

        // ==================================
        // MULAI SOAL BARU
        // ==================================
        if (upper.startsWith("JENIS")) {

            soalBaru();

            soal.jenis = item
                .split(":")[1]
                .trim()
                .toUpperCase();

            continue;
        }

        // Jika belum ada soal,
        // abaikan baris sebelum JENIS:
        if (!soal) continue;

        // ==================================
        // SOAL
        // ==================================
        if (upper.startsWith("SOAL")) {

            let isi = item.substring(item.indexOf(":") + 1).trim();

            if (isi !== "") {
                soal.pertanyaan += isi + " ";
            }

            continue;
        }

        // ==================================
        // GAMBAR
        // ==================================
        if (upper.startsWith("GAMBAR")) {

            soal.gambar = item
                .substring(item.indexOf(":") + 1)
                .trim();

            continue;
        }

        // ==================================
        // AUDIO
        // ==================================
        if (upper.startsWith("AUDIO")) {

            soal.audio = item
                .substring(item.indexOf(":") + 1)
                .trim();

            continue;
        }

        // ==================================
        // VIDEO
        // ==================================
        if (upper.startsWith("VIDEO")) {

            soal.video = item
                .substring(item.indexOf(":") + 1)
                .trim();

            continue;
        }

        // ==================================
        // PILIHAN A
        // ==================================
        if (/^A[\.\)]/i.test(item)) {

            soal.pilihan_a =
                item.substring(2).trim();

            continue;
        }

        // ==================================
        // PILIHAN B
        // ==================================
        if (/^B[\.\)]/i.test(item)) {

            soal.pilihan_b =
                item.substring(2).trim();

            continue;
        }

        // ==================================
        // PILIHAN C
        // ==================================
        if (/^C[\.\)]/i.test(item)) {

            soal.pilihan_c =
                item.substring(2).trim();

            continue;
        }

        // ==================================
        // PILIHAN D
        // ==================================
        if (/^D[\.\)]/i.test(item)) {

            soal.pilihan_d =
                item.substring(2).trim();

            continue;
        }

        // ==================================
        // PILIHAN E
        // ==================================
        if (/^E[\.\)]/i.test(item)) {

            soal.pilihan_e =
                item.substring(2).trim();

            continue;
        }

        
        // ==================================
// JAWABAN
// ==================================
const matchJawaban = item.match(/^JAWABAN\s*:\s*(.+)$/i);

if (matchJawaban) {

    soal.jawaban = matchJawaban[1]
        .trim()
        .toUpperCase();

    continue;

}

        // ==================================
// BOBOT
// ==================================
const matchBobot = item.match(/^BOBOT\s*:\s*(\d+)$/i);

if (matchBobot) {

    soal.bobot = Number(matchBobot[1]);

    continue;

}

        // ==================================
        // BARIS LANJUTAN PERTANYAAN
        // ==================================
        soal.pertanyaan += item + " ";

    }

    // Simpan soal terakhir
    simpanSoal();

    console.log("HASIL PARSER:");
console.log(JSON.stringify(hasil, null, 2));

    return hasil;

}

module.exports = parseWord;