# Pulihkan Penemuan Whiteboard di Rapat

**Cabang Fitur:** feature-restore-jitsi-whiteboard-discovery

## Terbitkan gateway peramban satu kali

Nextcloud Whiteboard kini mendeklarasikan `whiteboard:uiGateway` melalui satu penyedia kapabilitas khusus. Bilah navigasi tidak lagi mengklaim atau mengimpor penyedia yang sama sehingga registri UI yang dilindungi kepemilikan tidak mengalami pendaftaran ganda.

## Pulihkan kontrol Jitsi Meet

Jitsi Meet dapat memuat pabrik kanvas Whiteboard secara andal setelah backend mendeteksi kapabilitas server dengan ruang nama, sehingga tombol Whiteboard dan pembuatan kanvas bersama kembali tersedia di jendela rapat.

## Komit

- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
