# Meetings での Whiteboard 検出を復元

**機能ブランチ:** feature-restore-jitsi-whiteboard-discovery

## ブラウザーゲートウェイを一度だけ公開

Nextcloud Whiteboard は `whiteboard:uiGateway` を一つの専用 Capability Provider だけで宣言するようになりました。ナビゲーションバーは同じ Provider を宣言またはインポートしなくなり、所有者保護された UI Registry での重複登録を防ぎます。

## Jitsi Meet コントロールを復元

バックエンドが名前空間付きサーバー Capability を検出した後、Jitsi Meet は Whiteboard の Canvas Factory を確実に読み込めるようになり、ミーティングウィンドウの Whiteboard ボタンと共有 Canvas の作成が復元されます。

## コミット

- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
