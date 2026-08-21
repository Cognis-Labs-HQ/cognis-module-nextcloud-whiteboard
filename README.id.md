# Nextcloud Whiteboard

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Papan tulis kolaboratif yang didukung Nextcloud dan terintegrasi dengan kontrol akses Cognis. Repositori ini merupakan modul eksternal Cognis yang mandiri.

## Memulai

Instal modul melalui Marketplace Modul atau tempatkan di direktori modul eksternal yang telah dikonfigurasi. Aktifkan modul, buka **Nextcloud Whiteboard Settings**, lalu atur URL server Whiteboard, batas unggah gambar, dan kunci API bersama.

Pengguna dapat membuat dan memilih papan di `/whiteboards`, lalu berkolaborasi di `/whiteboard?id=<board-id>`. Pemilik dapat memberikan akses baca atau tulis melalui dialog berbagi host.

## Pemeriksaan kontributor

```sh
npm install
npm run lint
npm test
npm run check:manifest
git diff --check
```

Baca [`docs/standard.id.md`](docs/standard.id.md) untuk konfigurasi, capability, route, batas keamanan, dan panduan operasional.
