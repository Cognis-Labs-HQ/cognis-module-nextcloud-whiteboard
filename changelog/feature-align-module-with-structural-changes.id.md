# Selaraskan Whiteboard dengan Perubahan Struktural

**Cabang Fitur:** feature-align-module-with-structural-changes

## Gunakan kontribusi modul yang terlacak pemiliknya

Nextcloud Whiteboard kini mendaftarkan kapabilitas publik dan ekstensi alur berbagi terlindungi melalui konteks modul tercakupnya. Dengan demikian, Cognis dapat menegakkan kepemilikan kontribusi dan menghapus seluruh pendaftaran secara andal ketika modul dinonaktifkan atau dihapus.

## Terbitkan kontrak gateway Whiteboard yang stabil

Integrasi server tetap menggunakan ruang nama kapabilitas `whiteboard:` yang telah ditetapkan, termasuk `whiteboard:fetchBoardData`, `whiteboard:membership`, dan `whiteboard:deleteCanvas`. Ini sesuai dengan API modul yang terdokumentasi serta memulihkan verifikasi pemetaan dan sinkronisasi keanggotaan Jitsi Meet.

## Nyatakan penerbitan lintas ruang nama secara eksplisit

Cognis kini memerlukan hak istimewa ketika modul menerbitkan di luar ruang nama ID modulnya. Karena itu manifest meminta hak istimewa secara khusus untuk mempertahankan kontrak gateway bersama `whiteboard:` yang telah ditetapkan; pendaftaran kapabilitas tetap terlacak pemiliknya melalui konteks modul tercakup.

## Hindari pendaftaran ganda saat pengaktifan

Pembukaan jendela kini memiliki satu penerbit yang terlacak pemiliknya, dan hook berbagi hanya dipasang sekali untuk setiap konteks tercakup. Hal ini mencegah konflik kapabilitas dan alur menggagalkan pengaktifan modul.

## Gunakan kembali ruang nama berkas setelah pengaktifan ulang

Pengaktifan kini memeriksa ruang nama berkas Whiteboard yang ada sebelum mencoba mendaftarkannya. Ruang nama yang dipertahankan gateway Berkas selama siklus penonaktifan dan pengaktifan digunakan kembali, sedangkan instalasi baru tetap mendaftarkannya tepat satu kali.

## Kosongkan ruang label Tersimpan yang tersembunyi

Konfirmasi Tersimpan kini merapatkan jalur teks, lapisan dalam, dan jaraknya saat memudar. Tanda centang keberhasilan kembali dengan mulus ke tepi bilah alat tanpa meninggalkan celah tak terlihat selebar label.

## Pertahankan animasi label terlokalisasi

Teks Tersimpan dibungkus dalam jalur animasi yang aman dari luapan agar label dalam setiap bahasa yang didukung dapat mengembang dan merapat tanpa memotong kontrol di sebelahnya.

## Terbitkan gateway peramban satu kali

Nextcloud Whiteboard kini mendeklarasikan `whiteboard:uiGateway` melalui satu penyedia kapabilitas khusus. Bilah navigasi tidak lagi mengklaim atau mengimpor penyedia yang sama sehingga registri UI yang dilindungi kepemilikan tidak mengalami pendaftaran ganda.

## Pulihkan kontrol Jitsi Meet

Jitsi Meet dapat memuat pabrik kanvas Whiteboard secara andal setelah backend mendeteksi kapabilitas server dengan ruang nama, sehingga tombol Whiteboard dan pembuatan kanvas bersama kembali tersedia di jendela rapat.

## Gunakan satu ruang nama kapabilitas secara konsisten

API modul internal, pengujian pengaktifan, pembukaan jendela, penyematan, verifikasi papan, keanggotaan, penghapusan, dan gateway peramban kini semuanya memakai ruang nama kapabilitas `whiteboard:`. ID modul, jalur rute, ID hook alur, dan nama perintah CLI tetap `nextcloud-whiteboard` karena semuanya mengidentifikasi modul, bukan kontrak kapabilitasnya.

## Pertahankan Whiteboard sebelumnya di dalam panel

Daftar Whiteboard sebelumnya kini menempati baris panel awal yang tersisa dan menggulir secara vertikal untuk setiap ukuran daftar. Ukuran minimum grid dan luapan panel yang dipotong menjaga baris papan di dalam panel membulat bahkan pada jendela komponen yang pendek, sedangkan ruang bilah gulir yang stabil mencegah pergeseran tata letak horizontal.

## Hapus popup riwayat yang berlebihan

Panel awal sudah menampilkan setiap Whiteboard sebelumnya sebagai baris yang dapat dipilih langsung, sehingga tombol Riwayat Whiteboard duplikat dan popup noninteraktifnya telah dihapus. Bilah alat kanvas aktif juga tidak lagi menyediakan popup buntu yang sama, sehingga galat kapabilitas popup yang tidak terdefinisi beserta kode, teks, gaya, dan ikon yang tidak digunakan turut dihilangkan.

## Pulihkan verifikasi Whiteboard Jitsi

Modul kini menerbitkan kapabilitas `whiteboard:fetchBoardData` dan `whiteboard:membership` yang dideklarasikan langsung dari instans API yang telah diinisialisasi. Manifes juga mendeklarasikan kontribusi pengujian pengaktifan dan pembukaan jendela. Modul tidak lagi menerbitkan atau mencari fasad implementasi `whiteboard:api` yang tidak dideklarasikan, yang dapat menghentikan bootstrap sebelum Jitsi Meet menemukan penyedia verifikasi.

## Tampilkan lebih banyak Whiteboard tersimpan

Daftar Whiteboard tersimpan kini dapat bertambah hingga dua kali tinggi maksimum sebelumnya sebelum mulai menggulir secara vertikal. Lebih banyak papan terbaru dapat terlihat sekaligus, sementara luapan pada jendela yang lebih pendek tetap dibatasi.

## Terbitkan kontrak server Jitsi bersama penyedia API

Kapabilitas `whiteboard:fetchBoardData`, `whiteboard:membership`, dan `whiteboard:deleteCanvas` untuk Jitsi kini dikontribusikan bersama pada saat penyedia API Whiteboard dibuat. Bootstrap hanya menginisialisasi UI dan pendaftaran API, selaras dengan struktur integrasi Jitsi Meet terbaru serta mencegah kontrak verifikasi terlewat ketika rute Whiteboard langsung tetap tersedia.

## Pulihkan topologi penyedia Jitsi yang telah terbukti

API Whiteboard yang telah diinisialisasi disimpan satu kali di bawah kapabilitas milik modul `nextcloud-whiteboard:api`. Bootstrap menemukan instans yang sama persis dan menerbitkan empat kontrak `whiteboard:` yang telah digunakan Jitsi Meet. Hanya ada satu jalur pendaftaran internal dan satu jalur integrasi publik, tanpa fallback atau perilaku pendaftaran alternatif.

## Sediakan identitas pemilik Whiteboard kanonis

Verifikasi papan kini mengembalikan `createdByAccountId` bersama handle Nextcloud yang tersimpan. Nilai tersebut diselesaikan melalui kapabilitas identitas Social Profile saat ini agar selaras dengan model akun eksternal kanonis Cognis PR #225, sementara `createdBy` tetap tersedia untuk Nextcloud serta pemeriksaan judul dan pembuat Jitsi yang sudah ada.

## Komit

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
- [b622ea5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b622ea5b9fcc7b978a1287b68c9e96aeff3b1b9d)
- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
- [554d48f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/554d48fcd21fb08f5c08c9f902e011047bb0c8f5)
- [7c2d0f1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c2d0f1f067ff7b81985168133645d6863b790cc)
- [434d564](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/434d56417a6526813f6e6a5942c0e84f0d725c53)
- [b34069a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b34069ab3c09a29b4916517aee8e0fb757abcba4)
- [27a12c2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/27a12c2eacbf2354bd02a58818bcd158fdc88210)
- [20350c7](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/20350c7fb16536c0a795cb1bd8c4f4b88239848f)
- [17a3387](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/17a3387f0845b0dfd067d10f8ae45d5cea6cc8c6)
- [a7ec3f9](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a7ec3f9084dfbbb45543e087ca9931ca0a970712)
- [17d692b](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/17d692b66644d9cde959ac1728d62efa8d67c3a7)
- [d2c85fc](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d2c85fcc18c0f5eae4dd57de71d12ca5ecca5715)
- [4e77310](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4e77310afdfd9633870a10aeb8358b9f820d1459)
- [f32d660](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f32d66062e536f658767dd9a2d6768087c252e8c)
