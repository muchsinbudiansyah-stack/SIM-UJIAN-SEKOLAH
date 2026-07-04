document.addEventListener("DOMContentLoaded", () => {

    const jenis = document.getElementById("jenisSoal");

    if (!jenis) return;

    function tampilkanForm() {

        const pg = document.getElementById("formPG");
        const essay = document.getElementById("formEssay");
        const bs = document.getElementById("formBS");

        // sembunyikan semua
        pg.style.display = "none";
        essay.style.display = "none";
        bs.style.display = "none";

        switch (jenis.value) {

            case "PG":
                pg.style.display = "flex";
                break;

            case "ESSAY":
                essay.style.display = "flex";
                break;

            case "BS":
                bs.style.display = "flex";
                break;

            default:
                pg.style.display = "flex";
                break;
        }

    }

    jenis.addEventListener("change", tampilkanForm);

    tampilkanForm();

});

// ======================================
// PREVIEW GAMBAR
// ======================================

const inputGambar = document.getElementById("gambarSoal");

if (inputGambar) {

    inputGambar.addEventListener("change", function () {

        const file = this.files[0];

        const preview = document.getElementById("previewGambar");

        if (!file) {

            preview.style.display = "none";

            preview.src = "";

            return;

        }

        const reader = new FileReader();

        reader.onload = function (e) {

            preview.src = e.target.result;

            preview.style.display = "block";

        };

        reader.readAsDataURL(file);

    });

}