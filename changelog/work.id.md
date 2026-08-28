# Instalasi andal dan konfigurasi sebelum pengaktifan

**Cabang Fitur:** work

## Konfigurasi tersedia sebelum pengaktifan

Nextcloud Whiteboard memisahkan komponen inti Cognis yang diperlukan dari dependensi modul eksternal agar Cognis dapat menerapkan aturan siklus hidup yang tepat untuk setiap jenis dependensi.

## Inventaris integritas yang dapat diinstal

Inventaris berkas paket kini mencakup berkas reguler yang dapat diinstal dan mengecualikan tautan khusus repositori yang tidak dapat diunduh oleh penginstal modul.

## Pertahankan symlink petunjuk kontribusi

Petunjuk kontribusi tetap ditautkan ke petunjuk repositori kanonis, sedangkan inventaris modul yang dapat diunduh sengaja mengecualikan tautan khusus repositori tersebut.

## Instal tanpa meminta symlink repositori

Manifes yang dapat diunduh kini mengecualikan symlink petunjuk kontribusi karena API berkas repositori tidak menyediakannya sebagai berkas modul yang dapat diinstal. Symlink tersebut tetap tidak berubah di repositori.

## Selaraskan metadata dependensi dengan Cognis

UUID komponen inti tetap berada di `requires`, sedangkan bidang baru `hardDependencies` dan `softDependencies` secara tegas menyatakan bahwa Nextcloud Whiteboard tidak memiliki dependensi instalasi modul eksternal.

## Gunakan ruang umpan balik simpan hanya saat terlihat

Pil Tersimpan tidak lagi menyediakan ruang bilah alat saat tersembunyi. Pil masuk ke tata letak selama animasi konfirmasi dan kembali dihapus setelah animasi selesai.

## Simpan hanya perubahan kanvas nyata

Klik yang hanya memilih tidak lagi memancarkan peristiwa perubahan konten sehingga mengeklik kanvas yang tidak berubah tidak memicu penyimpanan atau umpan balik Tersimpan.

## Komit

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)

- [608dbd1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/608dbd18c9b362450d603f7e5d73585b22bf031d)

- [0098018](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0098018a714ce03e75bd4e6dc92fe06dd9db35f9)
