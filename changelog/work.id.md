# Instalasi andal dan konfigurasi sebelum pengaktifan

**Cabang Fitur:** work

## Konfigurasi tersedia sebelum pengaktifan

Nextcloud Whiteboard tidak lagi mendeklarasikan dependensi gateway wajib yang dapat mencegah pemuatan rute konfigurasinya saat modul dinonaktifkan. Integrasi waktu proses tetap menggunakan kapabilitas Cognis yang dideklarasikan.

## Inventaris integritas lengkap

Inventaris berkas paket kini mencakup petunjuk kontribusi sehingga mencegah peringatan integritas akibat checksum yang hilang saat pengaktifan.

## Pertahankan symlink petunjuk kontribusi

Petunjuk kontribusi tetap ditautkan ke petunjuk repositori kanonis, sementara perkakas manifes mengikuti tautan berkas yang valid tersebut untuk membuat dan memvalidasi checksum integritasnya.

## Komit

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)
