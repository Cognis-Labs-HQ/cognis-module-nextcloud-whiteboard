# Referensi Teknis

Antarmuka publik, konfigurasi, dan siklus hidup Papan Tulis.

## Antarmuka

Modul Nextcloud Whiteboard menyediakan kanvas gambar kolaboratif asli bagi pengguna Cognis dengan dukungan server Socket.IO Nextcloud Whiteboard mandiri. Cognis mengelola konfigurasi, otorisasi, persistensi, berbagi, dan antarmuka; server eksternal hanya mengirim perubahan adegan waktu nyata yang telah diotorisasi.

### Route API

Semua route berakar di `/api/v1/modules/nextcloud-whiteboard`:

- `GET` dan `PUT` / `DELETE /config` membaca dan memperbarui konfigurasi administrator.
- `GET /ping` melaporkan kesiapan modul.
- `POST /admin/enable-test` menjalankan pemeriksaan aktivasi administrator.
- `GET /whiteboards` mencantumkan papan yang dapat diakses; scope administrator dapat mencantumkan semuanya.
- `POST /whiteboards/spawn` membuat papan; `GET /whiteboards/launch` memberikan data peluncuran.
- `POST /whiteboards/preflight` memeriksa server eksternal.
- `GET /whiteboards/session` mengotorisasi papan dan mengembalikan data koneksi.
- `POST /whiteboards/elements` menyimpan snapshot adegan.
- `GET` dan `POST /whiteboards/presence` membaca dan memperbarui kehadiran.
- `POST /whiteboards/rename` mengganti nama papan milik pengguna.
- `GET` dan `POST /whiteboards/images` mengambil dan mengunggah gambar bernamespace.
- `GET /share`, `POST /share`, dan `POST /share/delete` mencantumkan, membuat, dan menghapus akses papan.

Validasi batas membatasi ukuran permintaan, menormalisasi pengenal, dan mengotorisasi sebelum logika bisnis. Dependensi yang tidak tersedia menghasilkan status layanan tidak tersedia; kegagalan operasional dicatat dengan metadata terstruktur yang aman.

## Konfigurasi

Manifes modul mendeklarasikan pengaturan dan dependensi yang didukung. Konfigurasikan hanya modul pemilik atau adapter autentikasi yang dideklarasikan melalui Administration; titik masuk aktif dan nonaktif mengikuti manifes.

### Konfigurasi dan validasi

Manifes mendeklarasikan preferensi `serverUrl`, `imageUploadMaxBytes`, dan `apiKey` dengan label terlokalisasi. URL harus memakai HTTP atau HTTPS. Batas unggah dinormalisasi menjadi angka nonnegatif. Kunci API yang diberikan harus minimal 16 karakter; menghilangkannya saat pembaruan mempertahankan rahasia tersimpan. Bidang tidak valid menghasilkan respons aman tanpa detail internal.

Endpoint preflight memeriksa konfigurasi, keterjangkauan HTTP, dan otorisasi websocket sebelum sesi dimulai. Endpoint enable-test hanya untuk administrator dan melaporkan kesiapan dependensi serta layanan eksternal.

### Bidang administrator yang dideklarasikan

| Kunci                 | Jenis      |
| --------------------- | ---------- |
| `serverUrl`           | `string`   |
| `imageUploadMaxBytes` | `number`   |
| `apiKey`              | `password` |

## Perilaku

### Presentasi milik provider dan flow aksi

Browser memperoleh `whiteboard:uiGateway` melalui ctx yang diinisialisasi host. `createCanvas({resourceType, resourceId, title, participantHandles})` dan `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` mengembalikan `{whiteboardId}`. `requestCanvasPage({signal})` mengembalikan deskriptor component-page; `openCanvas({whiteboardId, elementId, signal})` mengembalikan handle jendelanya. Pemanggil menyediakan target pemasangan sendiri dan membuang handle saat pembongkaran. Whiteboard memiliki identitas rute, parameter presentasi, token transport dan masa hidup; integrasi tidak boleh membangun ulang detail tersebut. Setiap pemasangan memerlukan ID kanvas yang tepat. Penyedia meminta tampilan tanpa bingkai pada tingkat teratas kontrak spawn host; konteks kanvas hanya berisi identitas dan mode.

Aksi store asinkron saat aktif menjalankan flow `nextcloud-whiteboard:*` milik modul melalui ctx dengan tahap `initialize-store` dan `execute-action`. Hasil yang hilang dan flow tidak aktif menghasilkan kesalahan. Konfigurasi saat nonaktif memakai store yang diinjeksi langsung karena host tidak mendaftarkan flow modul nonaktif. Autentikasi dan validasi mendahului perubahan; panggilan store internal mempertahankan transaksi. Penghapusan papan dan seluruh data berbagi katalog tabel dengan anak lebih dahulu; kegagalan membatalkan seluruh pembersihan.

Navigasi membatalkan pemeriksaan transport dan callback adegan tertunda. Respons sesi dan skrip yang usang tidak membuka kembali kanvas yang ditinggalkan. Pemeriksaan melepas socket, listener, timer dan handle skrip saat berhasil, gagal atau dibatalkan. Gaya page-composer tetap milik host.

Whiteboard memberi URL entri browser yang terdaftar revisi paket terpasang dari manifest. Entri provider dan kanvas mendapat URL baru setelah pembaruan Whiteboard meskipun build Cognis tidak berubah. Pengujian kontrak browser menghubungkan graf modul lokal yang sebenarnya dan menolak ekspor bernama yang hilang sebelum rilis. Muat ulang halaman yang sudah terbuka setelah memperbarui modul aktif agar konteks browser memakai provider baru.

Kanvas tertanam memakai viewport composer tanpa bingkai dengan pengguliran konten nonaktif. Permukaan tertanam mengisolasi ukuran intrinsik kanvas agar bilah alat dan area gambar sesuai dengan wadah, termasuk saat jendela rapat diperkecil atau diperbesar. Menyeret dengan tombol tengah hanya memindahkan viewport lokal dan tidak menerbitkan perubahan adegan, menyimpan snapshot atau mengubah status sinkronisasi.

### Arsitektur dan siklus hidup

`bootstrap.js` mendaftarkan UI dan API, menyumbangkan capability publik, dan memperluas `bootstrap-platform`. UI memakai page composer dan router host; API memiliki metadata papan, snapshot, kehadiran, konfigurasi, dan pembuatan sesi. Aktivasi mendaftarkan `/whiteboards`, `/whiteboard`, aset statis, navigasi, API, capability, dan hook flow berbagi; penonaktifan menghapus kontribusi dalam lingkup modul.

Browser menerima JWT berumur pendek untuk satu papan yang diotorisasi dan terhubung langsung ke endpoint Socket.IO. Kunci API administrator tetap di server. Snapshot adegan disimpan di Cognis untuk pemulihan setelah koneksi ulang, sedangkan Socket.IO menyebarkan pembaruan dan kehadiran langsung.

### Otorisasi dan berbagi

Semua operasi papan mengautentikasi melalui `auth:requireAuth`. Pemilik dapat mengganti nama dan mengelola daftar peserta. Peserta memperoleh akses sesuai peran tersimpan. Handle profil dinormalisasi sebelum dibandingkan dan profil tersembunyi tidak diekspos secara implisit.

Jika tersedia, modul memperluas `mint-share-token`, `resolve-share-token`, `construct-share-page`, dan `revoke-share-token`. Modul memvalidasi sumber daya sebelum mengotorisasi pembuat token, menolak tamu berbagi yang mencoba membuat atau mencabut berbagi, hanya menyelesaikan sumber daya `whiteboard`, dan memakai kontrak renderer berbagi publik host.

### Persistensi dan perilaku waktu nyata

Cognis menyimpan konfigurasi, papan, akses, kehadiran, dan snapshot melalui capability `db:executor`. Gambar memakai namespace modul dari capability files. ID dan token dibuat secara kriptografis aman dan tidak pernah memakai `Math.random`.

Klien menyambung kembali dengan jeda terbatas, menangguhkan pekerjaan waktu nyata saat tab tersembunyi, menggabungkan versi adegan, menyimpan perubahan nontransien, dan memperbarui kehadiran secara terpisah. Unggahan mematuhi batas byte. Unmount membersihkan socket, observer, event handler, dan sumber daya kanvas.

### Siklus hidup integrasi kanvas

Penyedia browser hanya menerbitkan `whiteboard:uiGateway` dari `mountProvider(ctx)`. Alur `nextcloud-whiteboard:requestCanvasPage`, `openCanvas`, `createCanvas`, dan `createDisposableCanvas` berjalan melalui konteks UI yang dibatasi. Penonaktifan membatalkan pembuatan tertunda dan menolak referensi gateway lama; pengaktifan ulang memasang kembali penyedia yang tersimpan. Markup kanvas tersemat berada di `ui/templates/` dan ukurannya diuji dengan Chromium/CDP tanpa Playwright.

### Administrasi kanvas dan kepemilikan sumber

Administrasi → Papan tulis menampilkan semua kanvas beserta pemilik, pengikatan sumber, pengguna aktif, dan waktu pembaruan. Filter Semua Kanvas, Kanvas Aktif, dan Kanvas Bermasalah mempersempit daftar. Penghapusan administrator membutuhkan konfirmasi dan mencabut berbagi sebelum menghapus snapshot, kehadiran, akses peserta, serta salinan pengguna. Token akses tidak ditampilkan. `whiteboard:sourceBinding` menyediakan `bind` dan `release` dengan `{whiteboardId, actorAccountId, sourceType, sourceId}`. Hanya pemilik kanvas dapat mengubah pengikatan; pembaruan bersyarat menolak sumber lain dengan `source_conflict`, sementara klaim ulang oleh sumber yang sama berhasil. Pelepasan mencocokkan sumber persis, termasuk saat membersihkan referensi duplikat lama. Operasi ini menggunakan alur penyimpanan terdaftar. Integrasi memberikan identitas sumber sendiri tanpa membaca mekanisme penyimpanan atau tampilan internal Whiteboard.

Perubahan sumber dan penghapusan kanvas juga mengizinkan administrator yang diverifikasi melalui kontrak publik `auth:accountStore`. Penghapusan mencabut berbagi kanvas dari setiap pemilik berbagi sebelum menghapus catatan kanvas. Nama tindakan server terdaftar menggunakan camel case setelah awalan modul yang tetap.

### Halaman Whiteboard langsung tanpa entri navigasi

Whiteboards tidak lagi menambahkan tautan menu navigasi. Galeri terlindungi `/whiteboards` dan URL kanvas `/whiteboard`, gateway tampilan kanvas, bagian administrasi serta entri halaman dan kanvas yang dapat dicari tetap tersedia. Plugin navbar hanya memiliki indeks pencarian dan menghapusnya saat dibongkar.

### Pemulihan kanvas hilang yang generik

Metadata papan penyedia menampilkan resourceReference netral berisi resourceType dan resourceId. Integrasi memakai identitas publik ini tanpa mengetahui penyimpanan internal. Penghapusan melepaskan kunci referensi; permintaan pembuatan atau penyelesaian berizin berikutnya menghasilkan pengganti kosong. Halaman mandiri pengguna masuk yang menerima respons sesi not_found dapat membuat pengganti melalui referensi kanvas generik, memuatnya sekali serta memperbarui ID aktif dan URL. Tampilan berbagi atau tertanam tidak membuat pengganti tersendiri. Kegagalan izin dan layanan diteruskan, dan respons hilang berulang tidak memulai perulangan percobaan. Pemulihan berhasil menampilkan toast; penyelesaian penyedia dicatat tanpa kredensial.

Administrasi kanvas menyediakan Semua Kanvas, Kanvas Aktif, dan Kanvas Bermasalah dengan pesan kosong tersendiri. Tampilan bermasalah menampilkan kanvas tanpa pemilik atau akses pemilik, ikatan sumber tidak lengkap, atau ikatan sumber generik maupun referensi sumber daya duplikat. Pil masalah kecil menjelaskan setiap temuan. Diagnostik hanya menggunakan data milik Whiteboard. Administrasi tetap memerlukan akses administrator dan tidak mengembalikan kredensial kanvas.

Implementasi kanvas berada di `api/canvas/` dan `ui/canvas/` dengan nama singkat seperti `source-binding.js`, `events.js`, dan `snapshot.js`. Probe aktivasi runtime bernama `api/configuration/enablement.js`; unit test tetap di `api/tests/`. Entri halaman berbagi memakai resolver aset berkualifikasi revisi yang sama dengan rute biasa. Administrasi mengecualikan kehadiran tidak aktif dan mengembalikan `invalid_json` untuk permintaan penghapusan rusak. Satu kanvas berizin pada jalur sumber daya kanonis mendapat referensi tetap tanpa mengubah konten. Jalur ambigu menghasilkan konflik dan masalah pada Kanvas Bermasalah, bukan pemilihan catatan otomatis.

### Panduan Halaman

[Tutorial Terpandu](TECHNICAL.id.md)

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

Penjelasan penghapusan kanvas menyoroti kontrol Hapus yang ditampilkan. Target pertama yang dapat digunakan dipilih dalam bagian tutorial; langkah dilewati jika tidak ada kontrol yang cocok.

Host bersama menyediakan aksi mengambang melalui antreannya. Kunjungan awal menawarkan Berikutnya/Selesai tanpa Batal atau Lewati; pemutaran ulang menawarkan Lewati sebelum tahap terlihat terakhir. Mulai Ulang Tutorial muncul setelah tahap terlihat pertama. Penyelesaian tetap berlaku setelah pembaruan konten. Flag highlightNext hanya mengaktifkan animasi berdenyut untuk penjelasan; pengurangan gerakan menonaktifkannya. Setiap tahap menyorot kontrol nyata berbeda sesuai urutan UI. Panduan tetap terikat ke tampilan aktif, menangani keadaan kosong dan opsional, serta membersihkan sumber daya saat navigasi atau pelepasan pemilik.

Di beranda Whiteboard, pilih Papan Baru atau papan tersimpan. Tindakan ini memulai cabang menggambar yang menunggu pemuatan kanvas selesai. Baru setelah itu penjelasan alat gambar, kanvas/riwayat, serta simpan/bagikan muncul. Berikutnya tanpa membuka papan melewati cabang tersebut; kanvas yang sudah terbuka langsung dimulai dari alat. Kanvas tersembunyi atau gagal dimuat tidak dianggap siap.

Panduan konfigurasi administrasi tetap memakai bagian host sebagai batas penemuan dan menyorot formulir milik modul yang berisi URL server, kunci API, dan batas unggahan. ID tata letak composer tidak menjadi target tutorial.

## Keamanan

Pemilik papan dan entri akses tersimpan mengatur baca, sunting, serta berbagi. Kunci server eksternal tetap di server; peramban menerima kredensial sesi papan berumur pendek. Asal websocket dan upgrade proksi harus sesuai layanan. Diagnostik klien memakai ui:log dengan nama galat aman, sedangkan umpan balik tetap terlokalisasi.

### Keamanan dan batasan operasional

Gunakan HTTPS untuk server whiteboard produksi dan lindungi kunci API sebagai rahasia. Origin harus dapat dijangkau Cognis dan browser pengguna; reverse proxy harus mengizinkan upgrade websocket. Sinkronisasi waktu diperlukan karena JWT sesi kedaluwarsa.

Gunakan hanya capability dan flow `ctx` publik yang dinyatakan dalam manifes. Jangan mengimpor internal gateway atau adapter Cognis, mengekspos kunci API ke browser, melewati router host, atau membuat panggilan API tanpa autentikasi. Buat ulang `manifest.files` setelah setiap perubahan file paket dan sinkronkan keempat varian dokumentasi serta locale.

## Referensi

- [manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/blob/HEAD/manifest.json)
- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/blob/HEAD/bootstrap.js)
- [Cognis](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/modules/external/TECHNICAL.en.md)

### Referensi kanvas yang dapat digunakan kembali

`createCanvas` dan `createDisposableCanvas` menerima `resourceType` dan `resourceId` generik. Keduanya menyelesaikan satu referensi kanvas tersimpan; permintaan berulang dan bersamaan mengembalikan kanvas berizin yang sama tanpa mereset isi atau keanggotaan. Basis data memastikan kunci referensi unik. Kanvas yang sudah ada dengan mode persistensi berbeda menimbulkan konflik, dan pemanggil tanpa izin tidak dapat menggunakannya kembali. Membuat kanvas persisten tanpa referensi menghasilkan kanvas baru yang terpisah. Penghapusan kanvas menghapus referensinya sehingga kanvas dapat dibuat lagi.

### Validasi nama

`npm test` memeriksa nama binding dengan detektor pohon sintaks lokal, termasuk bootstrap, skrip, pengujian, dan fixture. Kesalahan penguraian menggagalkan validasi. Fixture regresi mencakup deklarasi, parameter, anggota privat, penegasan tipe TypeScript, dan nama khusus tipe yang sah. Lihat [standar penamaan host](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.id.md#nama-binding) untuk kebijakan bersama. Istilah lazim seperti `args`, `db`, dan LDAP `dn` diperbolehkan sebagai nama mandiri. Nama gabungan, termasuk tipe dan metode upstream, memakai kata lengkap seperti `DatabaseExecutor`, `createDatabaseExecutor`, dan `baseDistinguishedName`; API milik komponen memakai satu nama kanonis pada deklarasi, ekspor, dan pemanggil. Alias ekspor yang hanya mengganti nama menggagalkan validasi.
