# Penggunaan

Buat dan bagikan kanvas gambar kolaboratif di Cognis.

## Prasyarat

Administrator harus mengatur server Whiteboard dan kunci API. Cognis dan peramban harus dapat menjangkaunya. Penyuntingan memerlukan akses tulis ke papan yang dipilih.

## Contoh

Buka Whiteboard lalu pilih New Board atau papan tersimpan. Tunggu status koneksi, kemudian menggambar atau melihat sesuai akses Anda.

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

Kesiapan kanvas dan izin tulis merupakan status terpisah yang dikonfirmasi pemilik. Setelah pemuatan, penjelasan koneksi tersedia bagi semua penonton. Langkah gambar dan riwayat memerlukan akses tulis; penerima hanya baca mendapat panduan geser/perbesar. Aksi edit dan berbagi yang tidak tersedia dikecualikan dari alur dan jumlah langkah.

## Hasil yang Diharapkan

Peserta berizin melihat papan bersama. Perubahan gambar tersinkronisasi; menggeser hanya memindahkan tampilan Anda. Menyimpan kanvas sementara membuat salinan yang dipertahankan.

## Pemecahan Masalah

Periksa jangkauan server, dukungan proksi websocket, dan kunci saat persiapan gagal. Akses hanya-baca menyembunyikan tindakan sunting; minta akses tulis kepada pemilik.
