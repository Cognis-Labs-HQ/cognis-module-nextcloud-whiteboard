# Siklus Aktivasi Whiteboard yang Andal

**Cabang Fitur:** feature-fix-module-enable-lifecycle-fail

## Mengisolasi konfigurasi praaktivasi

Nextcloud Whiteboard kini mendeklarasikan titik masuk API khusus saat modul dinonaktifkan yang hanya mendaftarkan rute konfigurasi dan pengujian aktivasi. Rute waktu proses, namespace penyimpanan, alur berbagi, dan kapabilitas Whiteboard publik ditunda hingga modul diaktifkan.

## Menggunakan pendaftaran konfigurasi bersama dengan aman

Titik masuk API aktif dan nonaktif menggunakan lapisan pendaftaran konfigurasi yang sama sehingga validasi, pengujian keterjangkauan, autentikasi, dan respons ketergantungan yang tidak tersedia tetap konsisten pada setiap tahap siklus.

## Memverifikasi kontrak siklus nonaktif

Cakupan otomatis mengonfirmasi titik masuk manifes dan memastikan pendaftaran saat nonaktif hanya membuka rute praaktivasi tanpa meminta kapabilitas berkas atau berbagi waktu proses.

## Lulus validasi batas modul yang diperketat

Browser Whiteboard kini memperoleh konteks UI host dari registri kapabilitas global publiknya, bukan dengan mengimpor jalur internal Cognis. Kontrol untuk membersihkan papan kini menggunakan kelas gaya milik modul sehingga kedua pelanggaran validasi yang menghalangi aktivasi telah dihapus.

## Komit

- [c419a3d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c419a3d499a9ab4668e23225f42587862d6beb45)

- [2c6ec86](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/2c6ec86d1e83b4a5157972e4877ed343390ab221)
