# Tutorial Terpandu

**Cabang Fitur:** feature-guided-tutorials

## Panduan Halaman

Panduan mencakup pemilihan papan, alat gambar, navigasi kanvas, riwayat, menyimpan dan berbagi, serta pengelolaan kanvas dan konfigurasi khusus administrator.

Host mengelola petunjuk, panah, sorotan, aksesibilitas, dan menu aksi mengambang bersama. Sesi pertama selalu menyediakan Berikutnya, tanpa Batal atau Lewati. Pemutaran ulang menyediakan Batal dengan `btn-cancel`. Penyelesaian disimpan di browser per akun. Navigasi, hilangnya akses, atau pelepasan penyedia mengakhiri sesi; pemasangan gagal membatalkan registrasi.

## Kunci Tutorial Deskriptif

Kunci terjemahan langkah tutorial dan pengenal sasaran menjelaskan topiknya, bukan posisinya dalam panduan. Kunci yang sama tersedia dalam keempat bahasa yang didukung.

## Tentukan isyarat Berikutnya per langkah

Setiap langkah tutorial kini menetapkan `highlightNext` secara eksplisit: penjelasan yang memerlukan Berikutnya atau Selesai mengaktifkannya, sedangkan latihan berbasis interaksi atau penantian menonaktifkannya. Pengurangan gerakan mempertahankan garis tepi statis.

Setiap komponen antarmuka wajib dicakup tutorial. Panduan kontribusi mengharuskan alur tugas yang berfokus pada pengguna dan peninjauan tutorial setiap kali fitur atau perilaku antarmuka berubah.

## Target tepat dan pengulangan cabang

Penjelasan penghapusan kanvas menyoroti kontrol Hapus yang ditampilkan. Target pertama yang dapat digunakan dipilih dalam bagian tutorial; langkah dilewati jika tidak ada kontrol yang cocok.

## Wilayah tutorial yang terlihat

Wilayah tutorial dan isyarat Berikutnya ditetapkan secara eksplisit.

## Antrean menu mengambang bersama

Menu mengikuti antrean host bersama dan masa hidup komponen.

## Kontrol pemulihan yang didokumentasikan

Tampilan target hilang menyediakan Berikutnya dan Mulai Ulang Tutorial; pemutaran ulang juga menyediakan Batal.

## Panduan tutorial terarah

Tutorial menjelaskan kontrol terlihat yang berbeda sesuai urutan UI. Petunjuk bersama mencakup penemuan tampilan aktif, contoh stabil, keadaan kosong, cabang bersyarat, dan pembersihan siklus hidup. Kontrol pemutaran ulang serta dokumentasi pengurangan gerakan sesuai host bersama.

## Katalog Terjemahan yang Konsisten

Kunci terjemahan menggunakan kata huruf kecil yang dipisahkan titik pada metadata modul dan tutorial. Entri katalog mempertahankan nilai terjemahan asli dan mengikuti indentasi XML di sekitarnya. Pemeriksaan namespace yang ketat menolak tanda hubung dan garis bawah pada kunci terjemahan. ID modul, UUID, kapabilitas, dan identitas penyelesaian tutorial tetap sama.

## Buka Kanvas Sebelum Menggambar

Di beranda Whiteboard, pilih Papan Baru atau papan tersimpan. Tindakan ini memulai cabang menggambar yang menunggu pemuatan kanvas selesai. Baru setelah itu penjelasan alat gambar, kanvas/riwayat, serta simpan/bagikan muncul. Berikutnya tanpa membuka papan melewati cabang tersebut; kanvas yang sudah terbuka langsung dimulai dari alat. Kanvas tersembunyi atau gagal dimuat tidak dianggap siap.

## Panduan Lengkap Dan Sesuai Akses

Kesiapan kanvas dan izin tulis merupakan status terpisah yang dikonfirmasi pemilik. Setelah pemuatan, penjelasan koneksi tersedia bagi semua penonton. Langkah gambar dan riwayat memerlukan akses tulis; penerima hanya baca mendapat panduan geser/perbesar. Aksi edit dan berbagi yang tidak tersedia dikecualikan dari alur dan jumlah langkah.

## Komit

- [b63cde3](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b63cde3de36183dd8426cad60e10112c9084571e)
- [93579f2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/93579f26a30ba1f4a2c778c37861e0ddaf0a3b80)
- [b97812e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b97812eb7fc854cfaa042c4342bbb713b3609162)
- [d9e3d34](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d9e3d346f2a3c878067dbb9d79e4624c28daf63d)
- [14a33e6](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/14a33e61511202c5c9c2e855f034e554ffd26d7e)
- [12e63fe54](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/12e63fe545ad3a0d93848bfc8b627723fff6f1de)
- [8e73fc9d4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8e73fc9d42b9731cc7fe0ea5265840a95e086134)
- [988d611](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/988d611e9c81379ac87e58f3e5373437ac72c227)
- [31c9ddb](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/31c9ddb55be15a7bd45329e8e8f1e36b16c44ef4)
- [1cae081](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1cae081454f489da6d998e5ba9543fd23cff7d03)
