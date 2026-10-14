# Isolasi integrasi kanvas dan siklus hidup

**Cabang Fitur:** feature-scoped-whiteboard-contract-cleanup

## Struktur berdasarkan tanggung jawab dan resolusi kanvas aman

Rilis 2.3.161 — Implementasi kanvas berada di `api/canvas/` dan `ui/canvas/` dengan nama singkat seperti `source-binding.js`, `events.js`, dan `snapshot.js`. Probe aktivasi runtime bernama `api/configuration/enablement.js`; unit test tetap di `api/tests/`. Entri halaman berbagi memakai resolver aset berkualifikasi revisi yang sama dengan rute biasa. Administrasi mengecualikan kehadiran tidak aktif dan mengembalikan `invalid_json` untuk permintaan penghapusan rusak. Satu kanvas berizin pada jalur sumber daya kanonis mendapat referensi tetap tanpa mengubah konten. Jalur ambigu menghasilkan konflik dan masalah pada Kanvas Bermasalah, bukan pemilihan catatan otomatis.

## Diagnostik administrasi kanvas

Rilis 2.3.160 — Administrasi kanvas menyediakan Semua Kanvas, Kanvas Aktif, dan Kanvas Bermasalah dengan pesan kosong tersendiri. Tampilan bermasalah menampilkan kanvas tanpa pemilik atau akses pemilik, ikatan sumber tidak lengkap, atau ikatan sumber generik maupun referensi sumber daya duplikat. Pil masalah kecil menjelaskan setiap temuan. Diagnostik hanya menggunakan data milik Whiteboard. Administrasi tetap memerlukan akses administrator dan tidak mengembalikan kredensial kanvas.

## Kontrak presentasi publik

Browser memperoleh `whiteboard:uiGateway` melalui ctx yang diinisialisasi host. `createCanvas({title, participantHandles})` dan `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` mengembalikan `{whiteboardId}`. `requestCanvasPage({signal})` mengembalikan deskriptor component-page; `openCanvas({whiteboardId, elementId, signal})` mengembalikan handle jendelanya. Pemanggil menyediakan target pemasangan sendiri dan membuang handle saat pembongkaran. Whiteboard memiliki identitas rute, parameter presentasi, token transport dan masa hidup; integrasi tidak boleh membangun ulang detail tersebut. Setiap pemasangan memerlukan ID kanvas yang tepat.

## Aksi milik modul dan pembersihan andal

Aksi store asinkron saat aktif menjalankan flow `nextcloud-whiteboard:*` milik modul melalui ctx dengan tahap `initialize-store` dan `execute-action`. Hasil yang hilang dan flow tidak aktif menghasilkan kesalahan. Konfigurasi saat nonaktif memakai store yang diinjeksi langsung karena host tidak mendaftarkan flow modul nonaktif. Autentikasi dan validasi mendahului perubahan; panggilan store internal mempertahankan transaksi. Penghapusan papan dan seluruh data berbagi katalog tabel dengan anak lebih dahulu; kegagalan membatalkan seluruh pembersihan.

Navigasi membatalkan pemeriksaan transport dan callback adegan tertunda. Respons sesi dan skrip yang usang tidak membuka kembali kanvas yang ditinggalkan. Pemeriksaan melepas socket, listener, timer dan handle skrip saat berhasil, gagal atau dibatalkan. Gaya page-composer tetap milik host.

## Entri browser berdasarkan revisi paket

Whiteboard memberi URL entri browser yang terdaftar revisi paket terpasang dari manifest. Entri provider dan kanvas mendapat URL baru setelah pembaruan Whiteboard meskipun build Cognis tidak berubah. Pengujian kontrak browser menghubungkan graf modul lokal yang sebenarnya dan menolak ekspor bernama yang hilang sebelum rilis. Muat ulang halaman yang sudah terbuka setelah memperbarui modul aktif agar konteks browser memakai provider baru.

## Navigasi kanvas tak terbatas tetap lokal

Kanvas tertanam memakai viewport composer tanpa bingkai dengan pengguliran konten nonaktif. Menyeret dengan tombol tengah hanya memindahkan viewport lokal dan tidak menerbitkan perubahan adegan, menyimpan snapshot atau mengubah status sinkronisasi.

## Sesuaikan kanvas tertanam dengan wadahnya

Isolasi ukuran kanvas tertanam mencegah tinggi bitmap sebelumnya memperbesar jendela komponen tanpa bingkai. Bilah alat dan kanvas berbagi tinggi wadah sebenarnya tanpa pemotongan atau pengguliran vertikal. Uji regresi Chromium memeriksa pemasangan bitmap terlalu besar dan perubahan ukuran wadah berulang. Gaya khusus Jitsi atau kerangka halaman tidak diperlukan.

## Kirim tata letak tertanam melalui kontrak halaman komponen

`openCanvas` kini menempatkan `borderless: true` pada tingkat teratas permintaan spawn halaman komponen. Flag tata letak di dalam konteks kanvas diabaikan broker host, sehingga halaman bersarang tidak mendapat ukuran mengikuti induk dan kanvas terisolasi menyusut. Konteks hanya memuat identitas dan mode kanvas. Uji gateway memeriksa permintaan publik dan pegangan jendela tanpa bingkai; regresi Chromium memanggil gateway dan renderer sebenarnya dalam wadah bersarang bermode standar.

## Standar kontributor templat

Selaraskan AGENTS.md dengan templat modul eksternal sambil mempertahankan aturan domain. Gunakan lokasi catatan rilis kanonis dan pertahankan konten historis serta identitas modul permanen.

## Struktur standar dan integrasi milik modul

Sinkronkan panduan templat, jalur rute domain, dokumentasi integrasi terjemahan, pemeriksaan struktur, dan hash paket akhir. Pertahankan URL publik dan identitas modul. Kontribusi browser mengikuti kontrak siklus hidup host masing-masing.

## Ilustrasi Cognis dan penyedia

Ganti banner Marketplace dengan komposisi Cognis + penyedia, tempatkan merek di pita tengah yang terlihat dan pertahankan ikon yang ada.

## Deskripsi Marketplace yang konsisten

Gunakan ringkasan tindakan singkat dan deskripsi fitur konkret pada metadata Marketplace dengan makna terjemahan yang selaras.

## Administrasi kanvas dan kepemilikan sumber

Administrasi → Papan tulis menampilkan semua kanvas beserta pemilik, pengikatan sumber, pengguna aktif, dan waktu pembaruan. Filter Semua kanvas, Aktif, dan Kanvas integrasi mempersempit daftar. Penghapusan administrator membutuhkan konfirmasi dan mencabut berbagi sebelum menghapus snapshot, kehadiran, akses peserta, serta salinan pengguna. Token akses tidak ditampilkan. `whiteboard:sourceBinding` menyediakan `bind` dan `release` dengan `{whiteboardId, actorAccountId, sourceType, sourceId}`. Hanya pemilik kanvas dapat mengubah pengikatan; pembaruan bersyarat menolak sumber lain dengan `source_conflict`, sementara klaim ulang oleh sumber yang sama berhasil. Pelepasan mencocokkan sumber persis, termasuk saat membersihkan referensi duplikat lama. Operasi ini menggunakan alur penyimpanan terdaftar. Integrasi memberikan identitas sumber sendiri tanpa membaca mekanisme penyimpanan atau tampilan internal Whiteboard.

Perubahan sumber dan penghapusan kanvas juga mengizinkan administrator yang diverifikasi melalui kontrak publik `auth:accountStore`. Penghapusan mencabut berbagi kanvas dari setiap pemilik berbagi sebelum menghapus catatan kanvas. Nama tindakan server terdaftar menggunakan camel case setelah awalan modul yang tetap.

## Referensi kanvas yang dapat digunakan kembali

Rilis 2.3.157 — `createCanvas` dan `createDisposableCanvas` menerima `resourceType` dan `resourceId` generik. Keduanya menyelesaikan satu referensi kanvas tersimpan; permintaan berulang dan bersamaan mengembalikan kanvas berizin yang sama tanpa mereset isi atau keanggotaan. Basis data memastikan kunci referensi unik. Kanvas yang sudah ada dengan mode persistensi berbeda menimbulkan konflik, dan pemanggil tanpa izin tidak dapat menggunakannya kembali. Membuat kanvas persisten tanpa referensi menghasilkan kanvas baru yang terpisah. Penghapusan kanvas menghapus referensinya sehingga kanvas dapat dibuat lagi.

## Halaman Whiteboard langsung tanpa entri navigasi

Rilis 2.3.158 — Whiteboards tidak lagi menambahkan tautan menu navigasi. Galeri terlindungi `/whiteboards` dan URL kanvas `/whiteboard`, gateway tampilan kanvas, bagian administrasi serta entri halaman dan kanvas yang dapat dicari tetap tersedia. Plugin navbar hanya memiliki indeks pencarian dan menghapusnya saat dibongkar.

## Pemulihan kanvas hilang yang generik

Rilis 2.3.159 — Metadata papan penyedia menampilkan resourceReference netral berisi resourceType dan resourceId. Integrasi memakai identitas publik ini tanpa mengetahui penyimpanan internal. Penghapusan melepaskan kunci referensi; permintaan pembuatan atau penyelesaian berizin berikutnya menghasilkan pengganti kosong. Halaman mandiri pengguna masuk yang menerima respons sesi not_found dapat membuat pengganti melalui referensi kanvas generik, memuatnya sekali serta memperbarui ID aktif dan URL. Tampilan berbagi atau tertanam tidak membuat pengganti tersendiri. Kegagalan izin dan layanan diteruskan, dan respons hilang berulang tidak memulai perulangan percobaan. Pemulihan berhasil menampilkan toast; penyelesaian penyedia dicatat tanpa kredensial.

## Komit

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
- [a42cff8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a42cff8c865ae0388fd3ded03d2e957e9ff5dd3e)
- [a79203e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a79203ed13a22bfe77ae59c32efe5b43b331c559)
- [c818b40](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c818b40db5010cb220cb54ffd23bc45940539f44)
- [05e253c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/05e253c37054f54197c4f79511f722ef96df4631)
- [6ea9026](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6ea902628f55686585e8f709ff0ddf79a1632a83)
- [080abb5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/080abb5cb88fee15491b2ef17787dfb7226890c3)
- [0db0f41](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0db0f410182c2c8d897360bc818e670ae391130e)
- [bd1f069](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/bd1f069c5bc597469c0b06cc7377ab4b837d6902)
- [b35f85d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b35f85daa2fd905fa6cf4efe2c1fc092f5c7bee5)
- [c8ecbc2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c8ecbc2fb2c8471a95302e9c92aea69f767e7501)
- [569cdc2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/569cdc2e3296f1d665b75bff1240f6738e084deb)
- [f90735c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f90735ca73e8df6644171083dd07f24e2d544515)
- [df1396f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/df1396fb4fb02272a31edcf9c274c2d3d5ba8e02)
- [bad53a2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/bad53a26a4d4fcc5dcb0ebefb30ef9dde7d37b31)
