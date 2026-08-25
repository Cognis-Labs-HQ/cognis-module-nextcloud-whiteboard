# Kanvas sekali pakai dan penyimpanan yang andal

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
