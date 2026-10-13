# Akses terdelegasi yang aman bagi tamu Whiteboard

**Cabang Fitur:** feature-add-delegated-access-support-to-whiteboard

## Validasi pembagian terdelegasi tanpa memperluas cakupannya

Tamu Whiteboard dapat menggunakan akses terdelegasi hanya jika gateway Share memvalidasi pembagian sumber, hubungan sumber daya milik penyedianya, dan operasi baca atau tulis yang diminta. Kontrak terdelegasi harus mengembalikan sumber daya dan kapabilitas Whiteboard yang persis sama sehingga tidak dapat menjadi pembagian Whiteboard yang lebih luas.

## Jaga kepemilikan rute API tetap terfokus

Rute konfigurasi kini berada dalam modul lapisan API tersendiri, sementara berkas pendaftaran utama mempertahankan jarak yang jelas antara impor, pendaftaran UI, dan fungsi yang diekspor.

## Komit

- [a94759f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a94759fa84f286554fc8eaf35b09e084dd6924c0)
