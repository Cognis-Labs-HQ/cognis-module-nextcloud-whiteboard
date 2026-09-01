# Bilah alat papan tulis yang lebih rapi

**Cabang Fitur:** feature-update-canvas-toolbar-ui-elements

## Kontrol gambar yang jelas dan mendukung tema

Simbol bilah alat diganti dengan berkas ikon SVG konsisten yang disimpan di `ui/reuse/assets/` dan mengikuti warna tema terang maupun gelap, pemilih warna membulat diperbesar, serta tindakan bersihkan dipindahkan ke samping judul kanvas.

## Pemformatan teks yang lebih baik

Pilihan jenis dan ukuran font ditambahkan saat alat Teks aktif, serta tata letak bilah format teks mengambang dibuat lebih seimbang.

## Kanvas komponen yang lebih terfokus

Tindakan papan tulis baru dan riwayat kini disembunyikan pada papan tulis yang dibuka di jendela komponen.

## Umpan balik kolaborasi langsung

Titik jangkar objek kini memakai kursor penunjuk. Pilihan jarak jauh segera dibersihkan saat objek dihapus, dan penanda kolaborator membedakan interaksi objek aktif dari aktivitas mengetik.

## Memulihkan konfirmasi pembersihan kanvas

Tombol bersihkan kini memakai penanganan peristiwa terdelegasi yang stabil pada bilah alat dan elemen tombol asli, sehingga dialog konfirmasi selalu terbuka setelah bilah alat diperbarui.

## Kursor kolaborasi akurat dan pembersihan pilihan

Membersihkan kanvas atau menghapus objek kini menghapus semua pilihan lokal dan jarak jauh yang terkait. Kursor kolaborator bawaan kanvas diperbarui lebih sering, berganti antara status bergerak dan mengetik, serta digantikan label langsung saat menggambar, mengetik, dan mengubah ukuran.

## Tata letak status tersimpan yang stabil

Bilah alat kini selalu menyediakan ruang selebar indikator Tersimpan yang diterjemahkan, sehingga animasi konfirmasinya tidak lagi menggeser kontrol di sebelahnya.

## Kanvas seukuran viewport

Grid dan kartu papan tulis kini dibatasi ke ukuran yang lebih kecil antara ruang induk dan tinggi viewport dinamis yang tersedia. Kanvas tidak lagi membuat dokumen bergulir dan tetap dapat dijelajahi melalui permukaan geser tanpa batas.

## Ukuran viewport milik composer

Seluruh gaya modul untuk elemen page shell telah dihapus. Papan tulis kini meminta pengguliran konten terbatas melalui payload page composer agar host menyesuaikan ukuran kanvas dengan viewport yang tersedia.

## Kapabilitas penghapusan kanvas

Kapabilitas `whiteboard:deleteCanvas` dengan otorisasi pemilik kini tersedia untuk alur pembersihan rapat. Penghapusan secara transaksional menghapus kehadiran kanvas, snapshot, salinan tersimpan, izin akses, dan data kanvas.

## Penghapusan oleh peserta tunggal

Kanvas dengan tepat satu peserta kini dapat dihapus oleh peserta tersebut meskipun metadata kepemilikan lama mencatat pengguna lain.

## Mempertahankan aktivitas kolaborator

Status menggambar, menekan, dan mengetik kini tetap tersedia bagi kolaborator jarak jauh meskipun tidak ada elemen kanvas yang dipilih.

## Menjaga konsistensi font dan penyuntingan teks

Bilah alat teks kini dimulai dengan font kanvas, dan perubahan satu gaya teks tidak lagi menimpa properti gaya lain pada elemen teks yang dipilih.

## Membuat kode kanvas lebih mudah dipelihara

Sumber kanvas mempertahankan struktur baris yang mudah dibaca dan menyerahkan pengelolaan status urungkan serta ulangi kepada modul terfokus yang diuji secara mandiri.

## Memulihkan jarak pada sumber kanvas

Baris kosong kembali memisahkan impor, fungsi, pengontrol, dan API kanvas yang dikembalikan agar sumber mempertahankan struktur yang mudah dibaca sebagaimana dimaksud.

## Komit

- [5359a44](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5359a44d3a62ae2e05175f96e4f1271802f54544)
- [4affd1e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4affd1ea400a8e2765418394c70af70997330fd8)
- [44cca91](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/44cca91a6dbf3e17f9a28e033e4dd0b9f7d8a631)
- [99ede14](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/99ede14d59284b809d724052c202396f9a810a94)
- [0e906e8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0e906e8b690c1274f9e3f0689cfbe5205a530097)
- [d7d09ed](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d7d09edc43bf57ef9fd16657aee467061ed1230d)
- [e80c294](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/e80c2945c9cced41d4b17faed29aef817b3455d8)
- [4c190bf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4c190bf57de58f5f23972b1fa56feeb53d590bfa)
- [16bb05b](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/16bb05b5270c657c48d8a275358c8e60a072e8e9)
- [0543ba2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0543ba2aaefddfdfdbad7f9cf725bae2ee48b1bf)
- [4813641](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/481364152037d9fedc01d64805d451d6a1f776fe)
- [b4408bd](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b4408bd9f834536b0e8ed31d84c81f3710bb8439)
- [d5ba8ae](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d5ba8aee43d16ca53d28f5a64551fd2c334b39bc)
- [e132015](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/e13201553ad7c13c1fed8d5796db558f05b35cd9)
