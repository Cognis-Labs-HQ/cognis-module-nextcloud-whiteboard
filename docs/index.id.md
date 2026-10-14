# Modul Nextcloud Whiteboard

Modul Nextcloud Whiteboard menyediakan kanvas gambar kolaboratif asli bagi pengguna Cognis dengan dukungan server Socket.IO Nextcloud Whiteboard mandiri. Cognis mengelola konfigurasi, otorisasi, persistensi, berbagi, dan antarmuka; server eksternal hanya mengirim perubahan adegan waktu nyata yang telah diotorisasi.

## Contoh penggunaan

**Mengonfigurasi layanan**

Aktifkan modul, buka **Nextcloud Whiteboard Settings**, lalu isi:

- **URL Server Whiteboard**, misalnya `https://whiteboard.example.com:3002`;
- **batas unggah gambar** dalam byte, dengan `0` untuk menonaktifkan unggahan gambar tempel; dan
- **kunci API**, rahasia bersama minimal 16 karakter untuk menandatangani token sesi berumur pendek.

Penyimpanan pengaturan memvalidasi nilai dan mendaftarkan origin server untuk koneksi browser yang diperlukan. Gunakan `cognisctl modules:nextcloud-whiteboard:ping` untuk memeriksa kesiapan dan `cognisctl modules:nextcloud-whiteboard:whiteboards` untuk mencantumkan papan sebagai administrator.

**Membuka dan membagikan papan**

Pengguna membuka `/whiteboards` untuk membuat atau memilih papan dan `/whiteboard?id=<board-id>` untuk mengerjakannya. Tambahkan `instantCanvas=1` untuk kanvas integrasi ringkas. Bilah alat mendukung pemilihan, gambar bebas, bentuk, panah, teks, penghapus, urungkan/ulangi, warna, lebar goresan, tempel gambar, riwayat, penggantian nama, dan pembersihan.

Pemilik dapat membuka popup berbagi host dari bilah alat dan memberi akses baca atau tulis. Penerima akun membuka papan secara langsung; penerima tautan diselesaikan melalui flow berbagi host dan hanya menerima capability yang diberikan.

Keanggotaan kanvas persisten hanya dikendalikan melalui kapabilitas CTX publik `whiteboard:membership`. Fungsi `add` dan `remove` menerima ID kanvas beserta ID akun pelaku dan pengguna yang kanonis, mengotorisasi pemilik kanvas, lalu mengubah satu peserta setiap kali.

**Mengintegrasikan melalui capability**

Dapatkan capability publik dari `ctx`; jangan mengodekan route komponen lain atau mengimpor internalnya:

```js
const getEmbedUrl = ctx.getCapability("whiteboard:getEmbedUrl");
const fetchBoardData = ctx.getCapability("whiteboard:fetchBoardData");
const spawnWhiteboardWindow = ctx.getCapability(
    "whiteboard:spawnWhiteboardWindow",
);

const url = getEmbedUrl(boardId, { instantCanvas: true });
const board = await fetchBoardData(boardId);
// board.createdByAccountId adalah ID akun Cognis kanonis.
await spawnWhiteboardWindow({
    title: "Shared canvas",
    createdBy: ownerHandle,
    participants: participantHandles,
});
```

`getEmbedUrl` mengembalikan `null` tanpa ID papan. Capability asinkron menolak saat API modul tidak tersedia atau pemanggil tidak berhak mengakses papan.

## Spesifikasi teknis

### Presentasi milik provider dan flow aksi

Browser memperoleh `whiteboard:uiGateway` melalui ctx yang diinisialisasi host. `createCanvas({title, participantHandles})` dan `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` mengembalikan `{whiteboardId}`. `requestCanvasPage({signal})` mengembalikan deskriptor component-page; `openCanvas({whiteboardId, elementId, signal})` mengembalikan handle jendelanya. Pemanggil menyediakan target pemasangan sendiri dan membuang handle saat pembongkaran. Whiteboard memiliki identitas rute, parameter presentasi, token transport dan masa hidup; integrasi tidak boleh membangun ulang detail tersebut. Setiap pemasangan memerlukan ID kanvas yang tepat. Penyedia meminta tampilan tanpa bingkai pada tingkat teratas kontrak spawn host; konteks kanvas hanya berisi identitas dan mode.

Aksi store asinkron saat aktif menjalankan flow `nextcloud-whiteboard:*` milik modul melalui ctx dengan tahap `initialize-store` dan `execute-action`. Hasil yang hilang dan flow tidak aktif menghasilkan kesalahan. Konfigurasi saat nonaktif memakai store yang diinjeksi langsung karena host tidak mendaftarkan flow modul nonaktif. Autentikasi dan validasi mendahului perubahan; panggilan store internal mempertahankan transaksi. Penghapusan papan dan seluruh data berbagi katalog tabel dengan anak lebih dahulu; kegagalan membatalkan seluruh pembersihan.

Navigasi membatalkan pemeriksaan transport dan callback adegan tertunda. Respons sesi dan skrip yang usang tidak membuka kembali kanvas yang ditinggalkan. Pemeriksaan melepas socket, listener, timer dan handle skrip saat berhasil, gagal atau dibatalkan. Gaya page-composer tetap milik host.

Whiteboard memberi URL entri browser yang terdaftar revisi paket terpasang dari manifest. Entri provider dan kanvas mendapat URL baru setelah pembaruan Whiteboard meskipun build Cognis tidak berubah. Pengujian kontrak browser menghubungkan graf modul lokal yang sebenarnya dan menolak ekspor bernama yang hilang sebelum rilis. Muat ulang halaman yang sudah terbuka setelah memperbarui modul aktif agar konteks browser memakai provider baru.

Kanvas tertanam memakai viewport composer tanpa bingkai dengan pengguliran konten nonaktif. Permukaan tertanam mengisolasi ukuran intrinsik kanvas agar bilah alat dan area gambar sesuai dengan wadah, termasuk saat jendela rapat diperkecil atau diperbesar. Menyeret dengan tombol tengah hanya memindahkan viewport lokal dan tidak menerbitkan perubahan adegan, menyimpan snapshot atau mengubah status sinkronisasi.

### Arsitektur dan siklus hidup

`bootstrap.js` mendaftarkan UI dan API, menyumbangkan capability publik, dan memperluas `bootstrap-platform`. UI memakai page composer dan router host; API memiliki metadata papan, snapshot, kehadiran, konfigurasi, dan pembuatan sesi. Aktivasi mendaftarkan `/whiteboards`, `/whiteboard`, aset statis, navigasi, API, capability, dan hook flow berbagi; penonaktifan menghapus kontribusi dalam lingkup modul.

Browser menerima JWT berumur pendek untuk satu papan yang diotorisasi dan terhubung langsung ke endpoint Socket.IO. Kunci API administrator tetap di server. Snapshot adegan disimpan di Cognis untuk pemulihan setelah koneksi ulang, sedangkan Socket.IO menyebarkan pembaruan dan kehadiran langsung.

### Konfigurasi dan validasi

Manifes mendeklarasikan preferensi `serverUrl`, `imageUploadMaxBytes`, dan `apiKey` dengan label terlokalisasi. URL harus memakai HTTP atau HTTPS. Batas unggah dinormalisasi menjadi angka nonnegatif. Kunci API yang diberikan harus minimal 16 karakter; menghilangkannya saat pembaruan mempertahankan rahasia tersimpan. Bidang tidak valid menghasilkan respons aman tanpa detail internal.

Endpoint preflight memeriksa konfigurasi, keterjangkauan HTTP, dan otorisasi websocket sebelum sesi dimulai. Endpoint enable-test hanya untuk administrator dan melaporkan kesiapan dependensi serta layanan eksternal.

### Otorisasi dan berbagi

Semua operasi papan mengautentikasi melalui `auth:requireAuth`. Pemilik dapat mengganti nama dan mengelola daftar peserta. Peserta memperoleh akses sesuai peran tersimpan. Handle profil dinormalisasi sebelum dibandingkan dan profil tersembunyi tidak diekspos secara implisit.

Jika tersedia, modul memperluas `mint-share-token`, `resolve-share-token`, `construct-share-page`, dan `revoke-share-token`. Modul memvalidasi sumber daya sebelum mengotorisasi pembuat token, menolak tamu berbagi yang mencoba membuat atau mencabut berbagi, hanya menyelesaikan sumber daya `whiteboard`, dan memakai kontrak renderer berbagi publik host.

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

### Persistensi dan perilaku waktu nyata

Cognis menyimpan konfigurasi, papan, akses, kehadiran, dan snapshot melalui capability `db:executor`. Gambar memakai namespace modul dari capability files. ID dan token dibuat secara kriptografis aman dan tidak pernah memakai `Math.random`.

Klien menyambung kembali dengan jeda terbatas, menangguhkan pekerjaan waktu nyata saat tab tersembunyi, menggabungkan versi adegan, menyimpan perubahan nontransien, dan memperbarui kehadiran secara terpisah. Unggahan mematuhi batas byte. Unmount membersihkan socket, observer, event handler, dan sumber daya kanvas.

### Keamanan dan batasan operasional

Gunakan HTTPS untuk server whiteboard produksi dan lindungi kunci API sebagai rahasia. Origin harus dapat dijangkau Cognis dan browser pengguna; reverse proxy harus mengizinkan upgrade websocket. Sinkronisasi waktu diperlukan karena JWT sesi kedaluwarsa.

Gunakan hanya capability dan flow `ctx` publik yang dinyatakan dalam manifes. Jangan mengimpor internal gateway atau adapter Cognis, mengekspos kunci API ke browser, melewati router host, atau membuat panggilan API tanpa autentikasi. Buat ulang `manifest.files` setelah setiap perubahan file paket dan sinkronkan keempat varian dokumentasi serta locale.

### Siklus hidup integrasi kanvas

Penyedia browser hanya menerbitkan `whiteboard:uiGateway` dari `mountProvider(ctx)`. Alur `nextcloud-whiteboard:requestCanvasPage`, `openCanvas`, `createCanvas`, dan `createDisposableCanvas` berjalan melalui konteks UI yang dibatasi. Penonaktifan membatalkan pembuatan tertunda dan menolak referensi gateway lama; pengaktifan ulang memasang kembali penyedia yang tersimpan. Markup kanvas tersemat berada di `ui/templates/` dan ukurannya diuji dengan Chromium/CDP tanpa Playwright.

### Struktur kontributor dan kepemilikan host

Mulai modul baru dari [cognis-module-template](https://github.com/Cognis-Labs-HQ/cognis-module-template); repositori ini mengikuti revisi panduan yang dicatat dalam `AGENTS.md`. `bootstrap.js` mengatur siklus hidup, `api/index.js` menghubungkan dependensi ctx, `api/routes/<domain>/index.js` menangani HTTP, dan `api/reuse/` berisi kode server yang dipakai ulang. Fitur browser berada di `ui/`, gaya di `ui/styles/`, templat bersama di `ui/templates/`, dan dokumentasi terjemahan di `docs/index.<locale>.md`. Riwayat rilis berada di `docs/changelog/` dan dikecualikan dari hash paket. Bagian opsional yang tidak didukung tidak dibuat.

Gunakan kapabilitas ctx publik dan alur yang dideklarasikan; jangan mengimpor bagian internal Cognis atau modul lain. Penyedia kapabilitas dan navigasi dasbor mengekspor `mountProvider(scopedUiCtx)` dan mengembalikan fungsi pembersihan sumber daya miliknya. Impor tidak boleh mendaftarkan perilaku modul. Host menghapus kapabilitas, kait alur, listener, dan status penyedia saat dinonaktifkan, lalu memasang kembali penyedia yang tersimpan saat diaktifkan ulang. Pabrik pengaturan, administrasi, dan penyedia deskriptor footer autentikasi mengikuti kontrak host masing-masing. Uji kontrak dengan pengganti mandiri, jalankan pemeriksaan struktur, perbarui hash setelah perubahan paket terakhir, lalu jalankan lint, pengujian, dan validasi manifes sebelum publikasi.

Banner Marketplace memadukan merek Cognis dan identitas penyedia dalam tata letak tengah yang aman dari pemotongan; ikon penyedia yang ada dipertahankan.
