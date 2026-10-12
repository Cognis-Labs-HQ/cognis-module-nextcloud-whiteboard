# Isolasi integrasi kanvas dan siklus hidup

**Cabang Fitur:** feature-scoped-whiteboard-contract-cleanup

## Kontrak presentasi publik

Browser memperoleh `whiteboard:uiGateway` melalui ctx yang diinisialisasi host. `createCanvas({title, participantHandles})` dan `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` mengembalikan `{whiteboardId}`. `requestCanvasPage({signal})` mengembalikan deskriptor component-page; `openCanvas({whiteboardId, elementId, signal})` mengembalikan handle jendelanya. Pemanggil menyediakan target pemasangan sendiri dan membuang handle saat pembongkaran. Whiteboard memiliki identitas rute, parameter presentasi, token transport dan masa hidup; integrasi tidak boleh membangun ulang detail tersebut. Setiap pemasangan memerlukan ID kanvas yang tepat.

## Aksi milik modul dan pembersihan andal

Aksi store asinkron saat aktif menjalankan flow `nextcloud-whiteboard:*` milik modul melalui ctx dengan tahap `initialize-store` dan `execute-action`. Hasil yang hilang dan flow tidak aktif menghasilkan kesalahan. Konfigurasi saat nonaktif memakai store yang diinjeksi langsung karena host tidak mendaftarkan flow modul nonaktif. Autentikasi dan validasi mendahului perubahan; panggilan store internal mempertahankan transaksi. Penghapusan papan dan seluruh data berbagi katalog tabel dengan anak lebih dahulu; kegagalan membatalkan seluruh pembersihan.

Navigasi membatalkan pemeriksaan transport dan callback adegan tertunda. Respons sesi dan skrip yang usang tidak membuka kembali kanvas yang ditinggalkan. Pemeriksaan melepas socket, listener, timer dan handle skrip saat berhasil, gagal atau dibatalkan. Gaya page-composer tetap milik host.

## Komit

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
- [a42cff8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a42cff8c865ae0388fd3ded03d2e957e9ff5dd3e)
