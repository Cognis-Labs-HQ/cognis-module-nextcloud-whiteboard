# Modul Nextcloud Whiteboard

Modul Nextcloud Whiteboard menyediakan kanvas gambar kolaboratif asli bagi pengguna Cognis dengan dukungan server Socket.IO Nextcloud Whiteboard mandiri. Cognis mengelola konfigurasi, otorisasi, persistensi, berbagi, dan antarmuka; server eksternal hanya mengirim perubahan adegan waktu nyata yang telah diotorisasi.

## Contoh penggunaan

**Mengonfigurasi layanan**

Aktifkan modul, buka **Nextcloud Whiteboard Settings**, lalu isi:

- **URL Server Whiteboard**, misalnya `https://whiteboard.example.com:3002`;
- **batas unggah gambar** dalam byte, dengan `0` untuk menonaktifkan unggahan gambar tempel; dan
- **kunci API**, rahasia bersama minimal 16 karakter untuk menandatangani token sesi berumur pendek.

Penyimpanan pengaturan memvalidasi nilai dan mendaftarkan origin server untuk koneksi browser yang diperlukan. Gunakan `cognisctl nextcloud-whiteboard:ping` untuk memeriksa kesiapan dan `cognisctl nextcloud-whiteboard:whiteboards` untuk mencantumkan papan sebagai administrator.

**Membuka dan membagikan papan**

Pengguna membuka `/whiteboards` untuk membuat atau memilih papan dan `/whiteboard?id=<board-id>` untuk mengerjakannya. Tambahkan `instantCanvas=1` untuk kanvas integrasi ringkas. Bilah alat mendukung pemilihan, gambar bebas, bentuk, panah, teks, penghapus, urungkan/ulangi, warna, lebar goresan, tempel gambar, riwayat, penggantian nama, dan pembersihan.

Pemilik dapat membuka popup berbagi host dari bilah alat dan memberi akses baca atau tulis. Penerima akun membuka papan secara langsung; penerima tautan diselesaikan melalui flow berbagi host dan hanya menerima capability yang diberikan.

Kanvas persisten yang sudah ada juga dapat menerima pengguna yang baru diundang saat kanvas aktif. Metode penyedia opsional `whiteboard:uiGateway.expandCanvasAccess` memvalidasi profil yang diminta dan memakai API yang diotorisasi pemilik untuk memperluas daftar izin editor tersimpan tanpa mengganti akses yang sudah ada.

**Mengintegrasikan melalui capability**

Dapatkan capability publik dari `ctx`; jangan mengodekan route komponen lain atau mengimpor internalnya:

```js
const getEmbedUrl = ctx.getCapability("whiteboard:getEmbedUrl");
const fetchBoardData = ctx.getCapability("whiteboard:fetchBoardData");
const spawnWhiteboardWindow = ctx.getCapability(
    "nextcloud-whiteboard:spawnWhiteboardWindow",
);

const url = getEmbedUrl(boardId, { instantCanvas: true });
const board = await fetchBoardData(boardId);
await spawnWhiteboardWindow({ whiteboardId: board.id });
```

`getEmbedUrl` mengembalikan `null` tanpa ID papan. Capability asinkron menolak saat API modul tidak tersedia atau pemanggil tidak berhak mengakses papan.

## Spesifikasi teknis

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

- `GET` dan `POST /config` membaca dan memperbarui konfigurasi administrator.
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
- `GET`, `POST`, dan `POST /share/delete` mencantumkan, membuat, dan menghapus akses papan.

Validasi batas membatasi ukuran permintaan, menormalisasi pengenal, dan mengotorisasi sebelum logika bisnis. Dependensi yang tidak tersedia menghasilkan status layanan tidak tersedia; kegagalan operasional dicatat dengan metadata terstruktur yang aman.

### Persistensi dan perilaku waktu nyata

Cognis menyimpan konfigurasi, papan, akses, kehadiran, dan snapshot melalui capability `db:executor`. Gambar memakai namespace modul dari capability files. ID dan token dibuat secara kriptografis aman dan tidak pernah memakai `Math.random`.

Klien menyambung kembali dengan jeda terbatas, menangguhkan pekerjaan waktu nyata saat tab tersembunyi, menggabungkan versi adegan, menyimpan perubahan nontransien, dan memperbarui kehadiran secara terpisah. Unggahan mematuhi batas byte. Unmount membersihkan socket, observer, event handler, dan sumber daya kanvas.

### Keamanan dan batasan operasional

Gunakan HTTPS untuk server whiteboard produksi dan lindungi kunci API sebagai rahasia. Origin harus dapat dijangkau Cognis dan browser pengguna; reverse proxy harus mengizinkan upgrade websocket. Sinkronisasi waktu diperlukan karena JWT sesi kedaluwarsa.

Gunakan hanya capability dan flow `ctx` publik yang dinyatakan dalam manifes. Jangan mengimpor internal gateway atau adapter Cognis, mengekspos kunci API ke browser, melewati router host, atau membuat panggilan API tanpa autentikasi. Buat ulang `manifest.files` setelah setiap perubahan file paket dan sinkronkan keempat varian dokumentasi serta locale.
