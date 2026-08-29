# Akses Whiteboard terdelegasi yang aman bagi tamu rapat

**Cabang Fitur:** feature-add-delegated-access-support-to-whiteboard

## Validasi pembagian rapat tanpa memperluas cakupannya

Tamu Whiteboard kini dapat menggunakan pembagian rapat yang tervalidasi hanya jika Jitsi mengonfirmasi hubungan rapat-ke-papan-tulis dan secara eksplisit mengizinkan operasi baca atau tulis yang diminta. Gateway Share tetap memvalidasi izin rapat asli dan tidak pernah mengubahnya menjadi pembagian papan tulis umum.

## Jaga kepemilikan rute API tetap terfokus

Rute konfigurasi kini berada dalam modul lapisan API tersendiri, sementara berkas pendaftaran utama mempertahankan jarak yang jelas antara impor, pendaftaran UI, dan fungsi yang diekspor.

## Komit

- [36613f8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/36613f8aee20aaf968045f9939af5e74010e4de7)
