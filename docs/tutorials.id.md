# Tutorial terpandu

Modul ini mengikat panduan pengantarnya pada halamannya melalui `ui:tutorials`. Kunjungan pertama yang diizinkan memulainya otomatis; SVG tanda tanya di samping judul halaman memutar ulang panduan. Host harus menyediakan kontrak tutorial terikat halaman versi satu.

## Contoh Penggunaan

Kesiapan kanvas dan izin tulis merupakan status terpisah yang dikonfirmasi pemilik. Setelah pemuatan, penjelasan koneksi tersedia bagi semua penonton. Langkah gambar dan riwayat memerlukan akses tulis; penerima hanya baca mendapat panduan geser/perbesar. Aksi edit dan berbagi yang tidak tersedia dikecualikan dari alur dan jumlah langkah.

## Spesifikasi Teknis

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

Penjelasan penghapusan kanvas menyoroti kontrol Hapus yang ditampilkan. Target pertama yang dapat digunakan dipilih dalam bagian tutorial; langkah dilewati jika tidak ada kontrol yang cocok.

Host bersama menyediakan aksi mengambang melalui antreannya. Kunjungan awal menawarkan Berikutnya/Selesai tanpa Batal atau Lewati; pemutaran ulang menawarkan Lewati sebelum tahap terlihat terakhir. Mulai Ulang Tutorial muncul setelah tahap terlihat pertama. Penyelesaian tetap berlaku setelah pembaruan konten. Flag highlightNext hanya mengaktifkan animasi berdenyut untuk penjelasan; pengurangan gerakan menonaktifkannya. Setiap tahap menyorot kontrol nyata berbeda sesuai urutan UI. Panduan tetap terikat ke tampilan aktif, menangani keadaan kosong dan opsional, serta membersihkan sumber daya saat navigasi atau pelepasan pemilik.

Di beranda Whiteboard, pilih Papan Baru atau papan tersimpan. Tindakan ini memulai cabang menggambar yang menunggu pemuatan kanvas selesai. Baru setelah itu penjelasan alat gambar, kanvas/riwayat, serta simpan/bagikan muncul. Berikutnya tanpa membuka papan melewati cabang tersebut; kanvas yang sudah terbuka langsung dimulai dari alat. Kanvas tersembunyi atau gagal dimuat tidak dianggap siap.
