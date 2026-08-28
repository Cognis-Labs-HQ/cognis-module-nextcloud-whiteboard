# Instalasi andal dan konfigurasi sebelum pengaktifan

**Cabang Fitur:** work

## Konfigurasi tersedia sebelum pengaktifan

Nextcloud Whiteboard tidak lagi mendeklarasikan dependensi gateway wajib yang dapat mencegah pemuatan rute konfigurasinya saat modul dinonaktifkan. Integrasi waktu proses tetap menggunakan kapabilitas Cognis yang dideklarasikan.

## Inventaris integritas yang dapat diinstal

Inventaris berkas paket kini mencakup berkas reguler yang dapat diinstal dan mengecualikan tautan khusus repositori yang tidak dapat diunduh oleh penginstal modul.

## Pertahankan symlink petunjuk kontribusi

Petunjuk kontribusi tetap ditautkan ke petunjuk repositori kanonis, sedangkan inventaris modul yang dapat diunduh sengaja mengecualikan tautan khusus repositori tersebut.

## Instal tanpa meminta symlink repositori

Manifes yang dapat diunduh kini mengecualikan symlink petunjuk kontribusi karena API berkas repositori tidak menyediakannya sebagai berkas modul yang dapat diinstal. Symlink tersebut tetap tidak berubah di repositori.

## Komit

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)
