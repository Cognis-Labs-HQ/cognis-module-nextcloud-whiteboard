# Integrasi Whiteboard Tercakup dan Terverifikasi

**Cabang Fitur:** feature-align-module-ownership-contract

## Gunakan kontribusi modul yang terlacak pemiliknya

Nextcloud Whiteboard kini mendaftarkan kapabilitas publik dan ekstensi alur berbagi terlindungi melalui konteks modul tercakupnya. Dengan demikian, Cognis dapat menegakkan kepemilikan kontribusi dan menghapus seluruh pendaftaran secara andal ketika modul dinonaktifkan atau dihapus.

## Terbitkan kapabilitas dalam ruang nama modul

Semua pengenal kapabilitas milik modul kini menggunakan awalan `nextcloud-whiteboard:`. Hook pelaporan bootstrap yang usang dan akses langsung ke konteks sistem telah dihapus agar kerja sama antarmodul mengikuti kontrak modul eksternal terkini.

## Nyatakan integrasi terlindungi secara eksplisit

Manifest kini meminta status berhak istimewa karena modul memperluas alur berbagi Cognis. Instalasi resmi dapat diverifikasi terhadap sumber tepercaya dan hash berkas paketnya, sementara pengujian menjaga persyaratan ruang nama dan hak istimewa.

## Komit

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
