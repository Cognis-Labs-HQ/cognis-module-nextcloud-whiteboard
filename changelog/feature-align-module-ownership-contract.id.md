# Integrasi Whiteboard Tercakup dan Terverifikasi

**Cabang Fitur:** feature-align-module-ownership-contract

## Gunakan kontribusi modul yang terlacak pemiliknya

Nextcloud Whiteboard kini mendaftarkan kapabilitas publik dan ekstensi alur berbagi terlindungi melalui konteks modul tercakupnya. Dengan demikian, Cognis dapat menegakkan kepemilikan kontribusi dan menghapus seluruh pendaftaran secara andal ketika modul dinonaktifkan atau dihapus.

## Terbitkan kapabilitas dalam ruang nama modul

Semua pengenal kapabilitas milik modul kini menggunakan awalan `nextcloud-whiteboard:`. Hook pelaporan bootstrap yang usang dan akses langsung ke konteks sistem telah dihapus agar kerja sama antarmodul mengikuti kontrak modul eksternal terkini.

## Nyatakan integrasi terlindungi secara eksplisit

Manifest kini meminta status berhak istimewa karena modul memperluas alur berbagi Cognis. Instalasi resmi dapat diverifikasi terhadap sumber tepercaya dan hash berkas paketnya, sementara pengujian menjaga persyaratan ruang nama dan hak istimewa.

## Hindari pendaftaran ganda saat pengaktifan

Pembukaan jendela kini memiliki satu penerbit yang terlacak pemiliknya, dan hook berbagi hanya dipasang sekali untuk setiap konteks tercakup. Hal ini mencegah konflik kapabilitas dan alur menggagalkan pengaktifan modul.

## Gunakan kembali ruang nama berkas setelah pengaktifan ulang

Pengaktifan kini memeriksa ruang nama berkas Whiteboard yang ada sebelum mencoba mendaftarkannya. Ruang nama yang dipertahankan gateway Berkas selama siklus penonaktifan dan pengaktifan digunakan kembali, sedangkan instalasi baru tetap mendaftarkannya tepat satu kali.

## Komit

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
