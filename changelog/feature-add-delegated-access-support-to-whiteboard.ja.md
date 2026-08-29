# ミーティングゲスト向けの安全な委任 Whiteboard アクセス

**機能ブランチ:** feature-add-delegated-access-support-to-whiteboard

## スコープを拡大せずにミーティング共有を検証

Whiteboard のゲストは、Jitsi がミーティングとホワイトボードの関連付けを確認し、要求された読み取りまたは書き込み操作を明示的に許可した場合に限り、検証済みのミーティング共有を利用できるようになりました。Share ゲートウェイは引き続き元のミーティング権限を検証し、一般的なホワイトボード共有へ変換することはありません。

## API ルートの責務を明確化

設定ルートを API レイヤー内の専用モジュールへ移し、メイン登録ファイルではインポート、UI 登録、エクスポート関数の間の明確な空行を維持しました。

## コミット

- [36613f8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/36613f8aee20aaf968045f9939af5e74010e4de7)
