# Tutorial terpandu

Modul ini mengikat panduan pengantarnya pada halamannya melalui `ui:tutorials`. Kunjungan pertama yang diizinkan memulainya otomatis; SVG tanda tanya di samping judul halaman memutar ulang panduan. Host harus menyediakan kontrak tutorial terikat halaman versi satu.

## Contoh Penggunaan

Panduan mencakup pemilihan papan, alat gambar, navigasi kanvas, riwayat, menyimpan dan berbagi, serta pengelolaan kanvas dan konfigurasi khusus administrator.

## Spesifikasi Teknis

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

Penjelasan penghapusan kanvas menyoroti kontrol Hapus yang ditampilkan. Target pertama yang dapat digunakan dipilih dalam bagian tutorial; langkah dilewati jika tidak ada kontrol yang cocok.

Host bersama menyediakan aksi mengambang melalui antreannya. Kunjungan awal menawarkan Berikutnya/Selesai tanpa Batal atau Lewati; pemutaran ulang menawarkan Lewati sebelum tahap terlihat terakhir. Mulai Ulang Tutorial muncul setelah tahap terlihat pertama. Penyelesaian tetap berlaku setelah pembaruan konten. Flag highlightNext hanya mengaktifkan animasi berdenyut untuk penjelasan; pengurangan gerakan menonaktifkannya. Setiap tahap menyorot kontrol nyata berbeda sesuai urutan UI. Panduan tetap terikat ke tampilan aktif, menangani keadaan kosong dan opsional, serta membersihkan sumber daya saat navigasi atau pelepasan pemilik.
