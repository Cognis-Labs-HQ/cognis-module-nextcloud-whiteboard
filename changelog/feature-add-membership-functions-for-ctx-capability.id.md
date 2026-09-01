# Tambahkan orkestrasi keanggotaan kanvas

**Cabang Fitur:** feature-add-membership-functions-for-ctx-capability

## Sediakan perubahan keanggotaan langsung

Jitsi Meet dan orkestrator lain kini dapat menambah atau menghapus peserta kanvas melalui kapabilitas CTX `whiteboard:membership` dengan ID akun pelaku dan pengguna yang kanonis. Hanya pemilik kanvas yang dapat melakukan perubahan ini, dan pemilik tidak dapat menghapus aksesnya sendiri.

## Perkuat perubahan keanggotaan

Perubahan keanggotaan kini menginisialisasi penyimpanan sebelum akses, menolak profil tersembunyi, mengambil kapabilitas identitas profil kanonis milik host pada saat pemanggilan agar status pendaftaran dan pengaktifannya saat ini dipatuhi, serta melaporkan kegagalan dependensi tanpa mengungkapkan detail internal.

## Komit

- [a5d8e7c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a5d8e7cc98565a24365e0e7f4faf42861c722c56)
- [972b573](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/972b573d595667a3cd6786327b13f3cf08a897d6)
- [ba1ec07](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ba1ec07cde8d4cdaceebdfc6295a3ed08c9eb33b)
