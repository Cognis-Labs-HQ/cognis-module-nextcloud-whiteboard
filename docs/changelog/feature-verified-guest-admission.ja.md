# 検証済みゲストのアクセス

**機能ブランチ:** `feature-verified-guest-admission`

## 検証済みゲストのアクセス

リソースルートは `share:getGuestClaims` から検証済みゲストクレームを取得した後、対象ボードと読み書き権限を確認します。画像、プレゼンス、セッション、起動の各リクエストでは、委任されたアクセスを含めてこれらの確認を維持します。アカウントおよび管理ルートには通常のアカウントセッションが必要です。アカウント名の `share:` 接頭辞はゲストを意味しません。このモジュール更新を有効にする前に、ホスト側の Share 資格情報検証契約を導入してください。

## 読み取り専用の通信と共有ボードの接続確認

Whiteboard のセッショントークンは、確定した書き込み権限をリアルタイムサーバーでも適用します。共有キャンバスは対象ボードの認可済みセッションを取得し、同じ限定トークンで WebSocket の接続を確認します。アカウント専用の全体事前確認は呼び出しません。通常アカウントの事前確認と管理上の制限は変更しません。

## コミット

- [7c5b43f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c5b43fd1cd3129e55f4c79b278b068d2be6c25c)
- [f9f8964](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f9f896488c44628f14cfc80b44b7a5324b000def)
