# Isolasi integrasi kanvas dan siklus hidup

**Cabang Fitur:** feature-scoped-whiteboard-contract-cleanup

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
