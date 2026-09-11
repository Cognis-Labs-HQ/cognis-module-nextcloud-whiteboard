# Siklus Aktivasi Whiteboard yang Andal

**Cabang Fitur:** feature-fix-module-enable-lifecycle-fail

## Mengisolasi konfigurasi praaktivasi

Nextcloud Whiteboard kini mendeklarasikan titik masuk API khusus saat modul dinonaktifkan yang hanya mendaftarkan rute konfigurasi dan pengujian aktivasi. Rute waktu proses, namespace penyimpanan, alur berbagi, dan kapabilitas Whiteboard publik ditunda hingga modul diaktifkan.

## Menggunakan pendaftaran konfigurasi bersama dengan aman

Titik masuk API aktif dan nonaktif menggunakan lapisan pendaftaran konfigurasi yang sama sehingga validasi, pengujian keterjangkauan, autentikasi, dan respons ketergantungan yang tidak tersedia tetap konsisten pada setiap tahap siklus.

## Memverifikasi kontrak siklus nonaktif

Cakupan otomatis mengonfirmasi titik masuk manifes dan memastikan pendaftaran saat nonaktif hanya membuka rute praaktivasi tanpa meminta kapabilitas berkas atau berbagi waktu proses.

## Komit

- [8d61422](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8d61422c80b020af8d4734b7bc52e213b83da5d0)
