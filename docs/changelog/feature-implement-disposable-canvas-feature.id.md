# Kanvas sekali pakai dan penyimpanan yang andal

**Cabang Fitur:** feature-implement-disposable-canvas-feature

## Kanvas rapat sekali pakai

Pemanggil terintegrasi dapat membuka kanvas sementara yang hanya disimpan ketika seorang pengguna menekan Simpan.

## Salinan tersimpan untuk banyak pengguna

Kanvas biasa kini membuat dan memperbarui salinan tersimpan bagi setiap anggota, sedangkan salinan dari pembagian yang dicabut akan dihapus.

## Beranda kanvas dan status penyimpanan yang lebih jelas

Kartu membesar saat kanvas bertambah dan dapat digulir setelah empat entri, sementara lampu status mengonfirmasi penyimpanan dengan tanda centang animasi dan label Tersimpan.

## Gateway integrasi rapat

Gateway UI peramban global kini memungkinkan integrasi rapat membuat atau menemukan kanvas sekali pakai yang tersinkronisasi tanpa bergantung pada rute HTTP milik modul lain.

## Pendaftaran kapabilitas UI yang kompatibel

Gateway Whiteboard kini menggunakan API kontribusi kapabilitas peramban yang kanonis tanpa menyebabkan galat runtime saat login tertunda atau popup galat umum.

## Penemuan penyedia gateway Whiteboard

Entri bilah navigasi Whiteboard kini mendeklarasikan kapabilitas perambannya agar pemuat penyedia host mengimpor gateway sebelum Jitsi mengikat tombol Whiteboard opsional.

## Membuka kanvas sekali pakai tertanam

Jendela komponen kini menggunakan status fokus yang diberikan dan langsung membuka kanvas sekali pakai yang diminta, bukan menampilkan beranda Whiteboard.

## Jendela komponen bertarget elemen

Mount komponen bertarget elemen kini tetap tanpa bingkai dan menunggu kanvas sekali pakai yang difokuskan terbuka sebelum melaporkan halaman komponen siap.

## Siklus hidup komponen terlindungi

Mount komponen Whiteboard kini mematuhi kebijakan navigasi host dan mengembalikan handle destroy idempoten untuk siklus hidup jendela komponen yang terlindungi.

## Serah terima kanvas rapat yang disiapkan

Gateway peramban kini menyimpan kanvas sekali pakai yang telah disiapkan sehingga mount komponen dapat memulihkan kanvas yang tepat ketika host memberikan konteks fokus terbungkus atau tidak lengkap.

## Pembersihan komponen yang aman untuk rute

Pembersihan komponen kini melepas listener pembatalan, mengabaikan handle mount usang, dan membersihkan status mount Whiteboard sebelum Cognis menyelesaikan navigasi SPA yang digerakkan discardAll.

## Entri langsung berbatas rute

Entri peramban Whiteboard kini melakukan mount langsung otomatis hanya pada /whiteboard dan /whiteboards sehingga impor komponen di halaman lain tidak dipasang ke root host yang tidak terkait.

## Bilah alat kanvas ringkas

Bilah alat kanvas kini menggulir alat gambar dalam jendela komponen sempit sambil mempertahankan status simpan terlihat, dan perubahan kanvas sekali pakai selalu menampilkan tombol Simpan yang disorot hingga tersimpan.

## Bilah alat terbungkus dan kanvas sekali pakai privat

Bilah alat ringkas kini membungkus kontrol ke baris yang tersedia alih-alih menggulir secara horizontal. Kanvas sekali pakai langsung menampilkan Simpan, mempertahankannya saat ada perubahan, dan menyembunyikan kontrol berbagi.

## Satu kanvas tersinkronisasi untuk setiap anggota yang menyimpan

Penyimpanan manual dan otomatis kini menyimpan kanvas kolaboratif lengkap sebagai cuplikan utama. Setiap orang yang membuka kembali kanvas bersama menerima konten terkini yang sama, sedangkan penyimpanan kanvas sekali pakai hanya memperbarui salinan anggota yang telah memilih untuk menyimpan.

## Kolaborasi dan pembatalan yang aman dari konflik

Penyimpanan serentak kini dijalankan secara berurutan agar perubahan seorang peserta tidak menimpa perubahan peserta lain. Urungkan dan ulangi juga menerbitkan revisi elemen yang lebih baru, sementara kontrol sesi sekali pakai diperbarui segera setelah metadata sesi tersedia.

## Modul aplikasi yang mudah dipelihara

Navigasi Whiteboard dan pemeriksaan awal koneksi kini berada dalam modul terfokus. Entri utama aplikasi mempertahankan baris kosong yang jelas di antara setiap fungsi tingkat atas dan tetap mudah dibaca tanpa format yang dipadatkan.

## Komit

- [456de64](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/456de64983b6986869dfa66094e4b7bcdd48cfcc)
- [1a7f5f6](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1a7f5f6f12268886a79afb3c51ed4f2b966b282d)
- [f033368](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f03336872aee142eac55cdea8c92d71a42de3755)
- [8778738](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8778738e12e864855d02f8f99076fca7504b1b22)
- [2cfb57e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/2cfb57e1ef85ef9dcdce0caeeecb7405b7a01a12)
- [7458d9e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7458d9ec32920a361d12e38c0c08b3cf571d6857)
- [71c41ad](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/71c41ad6a516a09c3c5c3e0454391ed63335c29b)
- [946d0dc](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/946d0dc64258f227c718b6627f54bdb4346aa1a6)
- [f822dbe](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f822dbe74798c2a8811cf59ffb8b410c1887cff8)
- [02841fd](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/02841fda50435799a91e4ebc97d2c192aa168247)
- [3f7a212](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3f7a2127625a9b60edc21eac8e0924544da1b6d6)
- [407852f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/407852fcfefdb72fc5c0d28d41a8889bd039b450)
- [4a69ab1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4a69ab19d181394dd8d96815ed0387cb03d756e0)
- [96a577d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96a577d1c4200e82ddf46f3be484bd972c8d57fb)
- [a55768d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a55768d1b367d662b84254069a682fd94d3a88ad)
- [b38fef2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b38fef2316dd81957f95542ceef74e5fcb7d0cee)
