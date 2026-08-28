# 信頼性の高いホワイトボードデータベース初期化

**機能ブランチ:** feature-fix-sql-execution-errors

## 同時スキーマ作成の防止

ホワイトボードのリクエストが単一のデータベーススキーマ初期化処理を共有するようになり、リクエストが同時に到着した際の PostgreSQL の型重複エラーを防止します。初期化に失敗した場合は再試行できます。

## コミット

- [96d40aa](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96d40aac42fe25c75fa02a0f2bb224896bc3f450)
