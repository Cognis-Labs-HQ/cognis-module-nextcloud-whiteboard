# Penuhi ruang kerja Whiteboard

## Gunakan tata letak pemasangan baru

Nextcloud Whiteboard kini menggunakan tata letak page composer tanpa bingkai dengan tinggi tetap agar kanvas memenuhi widget yang tersedia tanpa pengguliran konten bertingkat.

## Batasi luapan kanvas

Area kanvas tidak lagi membuat area gulir otomatis sendiri sehingga interaksi menggambar tetap sejajar dengan widget yang terlihat.

## Sempurnakan jendela komponen

Whiteboard yang dipasang sebagai komponen tetap menyediakan pelacakan penunjuk kolaboratif, tetapi tidak menampilkan tombol Bagikan. Pemasangan yang memenuhi induk dibatasi pada tinggi komponen untuk mencegah luapan vertikal, sedangkan kontrol berbagi tetap berada di halaman Whiteboard lengkap.

## Gunakan sumber daya pakai ulang milik host

Kode browser Whiteboard kini memperoleh utilitas dan gaya bersama melalui kapabilitas `ui:reuse`. CSS modul yang usang dan pembungkus elemen tersimpan yang redundan telah dihapus sehingga Cognis tetap menjadi satu-satunya pemilik perilaku UI yang dapat digunakan kembali.
