# Whiteboard ゲスト向けの安全な委任アクセス

**機能ブランチ:** feature-add-delegated-access-support-to-whiteboard

## スコープを拡大せずに委任共有を検証

Whiteboard のゲストが委任アクセスを利用できるのは、Share ゲートウェイが元の共有、プロバイダー所有のリソース関連付け、要求された読み取りまたは書き込み操作を検証した場合だけです。委任契約は正確な Whiteboard リソースとケーパビリティを返す必要があるため、より広範な Whiteboard 共有にはなりません。

## API ルートの責務を明確化

設定ルートを API レイヤー内の専用モジュールへ移し、メイン登録ファイルではインポート、UI 登録、エクスポート関数の間の明確な空行を維持しました。

## コミット

- [a94759f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a94759fa84f286554fc8eaf35b09e084dd6924c0)
