# Inisialisasi basis data whiteboard yang andal

**Cabang Fitur:** feature-fix-sql-execution-errors

## Mencegah pembuatan skema secara bersamaan

Permintaan whiteboard kini berbagi satu operasi inisialisasi skema basis data sehingga mencegah galat tipe duplikat PostgreSQL ketika permintaan tiba bersamaan. Inisialisasi yang gagal tetap dapat dicoba kembali.

## Hanya paketkan berkas repositori yang dapat dipasang

Manifes modul tidak lagi mencantumkan symlink repositori sebagai berkas yang dapat diunduh sehingga mencegah kegagalan pemasangan ketika API berkas repositori tidak dapat menyediakan jalur symlink.

## Komit

- [96d40aa](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96d40aac42fe25c75fa02a0f2bb224896bc3f450)
- [cf6e6b1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/cf6e6b10f2c61e7757d9513db88a84a9a0a65f7f)
