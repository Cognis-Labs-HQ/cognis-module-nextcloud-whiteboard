# Penuhi ruang kerja Whiteboard

**Cabang Fitur:** feature-update-nextcloud-whiteboard-mount-layout

## Gunakan tata letak pemasangan baru

Nextcloud Whiteboard kini menggunakan tata letak page composer tanpa bingkai dengan tinggi tetap agar kanvas memenuhi widget yang tersedia tanpa pengguliran konten bertingkat.

## Batasi luapan kanvas

Area kanvas tidak lagi membuat area gulir otomatis sendiri sehingga interaksi menggambar tetap sejajar dengan widget yang terlihat.

## Sempurnakan jendela komponen

Whiteboard yang dipasang sebagai komponen tetap menyediakan pelacakan penunjuk kolaboratif, tetapi tidak menampilkan tombol Bagikan. Kisi kanvas dibatasi pada tinggi induk dan hanya memberikan ruang yang tersisa di bawah bilah alat kepada kanvas. Hal ini mencegah luapan vertikal, sedangkan kontrol berbagi tetap berada di halaman Whiteboard lengkap.

## Gunakan sumber daya pakai ulang milik host

Kode browser Whiteboard kini memperoleh utilitas dan gaya bersama melalui kapabilitas `ui:reuse`. CSS modul yang usang dan pembungkus elemen tersimpan yang redundan telah dihapus sehingga Cognis tetap menjadi satu-satunya pemilik perilaku UI yang dapat digunakan kembali.

## Komit

- [1c5cd96](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1c5cd967cfd773f0453ae41429dd37abacb5d046)
- [6bda211](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6bda2116eb158add7b7d56caee3d8926dd58d7da)
- [cc3318c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/cc3318cda3855bec02fa96bd11056e19b5483f9a)
- [264d2b2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/264d2b2342fbf2c25b1b0e65146e9dbddd0f10c2)
- [f1bf36e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f1bf36e764fa022f7f59e405d697d4fcc0afc049)
- [23dd970](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/23dd970372c2f0d16e379e68cacb733f274ecf4a)
