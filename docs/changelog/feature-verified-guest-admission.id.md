# Akses tamu terverifikasi

**Cabang Fitur:** `feature-verified-guest-admission`

## Akses tamu terverifikasi

Rute sumber daya memperoleh klaim tamu terverifikasi melalui `share:getGuestClaims` sebelum memeriksa papan serta kapabilitas baca/tulis yang tepat. Permintaan gambar, kehadiran, sesi, dan peluncuran tetap menjalankan pemeriksaan ini, termasuk akses yang didelegasikan. Rute akun dan administrasi memerlukan sesi akun biasa. Awalan nama akun `share:` tidak menandakan tamu. Pasang kontrak penerimaan kredensial Share pada host sebelum mengaktifkan pembaruan modul ini.

## Transport hanya baca dan kesiapan papan bersama

Token sesi Whiteboard kini menegakkan izin tulis yang telah ditentukan pada server waktu nyata. Kanvas bersama memperoleh sesi papan yang diotorisasi sebelum memeriksa kesiapan websocket menggunakan token terbatas yang sama. Kanvas tidak memanggil pemeriksaan awal global khusus akun; pemeriksaan awal akun biasa dan pembatasan administrasi tetap berlaku.

## Komit

- [7c5b43f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c5b43fd1cd3129e55f4c79b278b068d2be6c25c)
- [f9f8964](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f9f896488c44628f14cfc80b44b7a5324b000def)
