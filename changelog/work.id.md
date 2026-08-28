# Inisialisasi basis data whiteboard yang andal

**Cabang Fitur:** work

## Mencegah pembuatan skema secara bersamaan

Permintaan whiteboard kini berbagi satu operasi inisialisasi skema basis data sehingga mencegah galat tipe duplikat PostgreSQL ketika permintaan tiba bersamaan. Inisialisasi yang gagal tetap dapat dicoba kembali.

## Komit

- [96d40aa](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96d40aac42fe25c75fa02a0f2bb224896bc3f450)
