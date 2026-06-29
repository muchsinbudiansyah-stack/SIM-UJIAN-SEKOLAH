function validateSoal(soal) {

    const hasil = [];

    soal.forEach((item, index) => {

        const error = [];

        if (!item.jenis) {
            error.push("Jenis soal belum diisi.");
        }

        if (!item.pertanyaan) {
            error.push("Pertanyaan kosong.");
        }

        if (item.jenis === "PG") {

            if (!item.pilihan_a) error.push("Pilihan A kosong.");
            if (!item.pilihan_b) error.push("Pilihan B kosong.");

            if (
                !["A","B","C","D","E"].includes(
                    item.jawaban.toUpperCase()
                )
            ) {
                error.push("Jawaban PG tidak valid.");
            }

        }

        if (item.jenis === "ESSAY") {

            // Essay tidak membutuhkan pilihan jawaban

        }

        if (item.jenis === "BS") {

            if (
                item.jawaban.toUpperCase() !== "BENAR" &&
                item.jawaban.toUpperCase() !== "SALAH"
            ) {

                error.push("Jawaban Benar/Salah tidak valid.");

            }

        }

        hasil.push({

            nomor: index + 1,

            valid: error.length === 0,

            error,

            data: item

        });

    });

    return hasil;

}

module.exports = validateSoal;