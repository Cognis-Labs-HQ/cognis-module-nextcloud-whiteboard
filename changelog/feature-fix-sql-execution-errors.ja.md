# 信頼性の高いホワイトボードデータベース初期化

**機能ブランチ:** feature-fix-sql-execution-errors

## 同時スキーマ作成の防止

ホワイトボードのリクエストが単一のデータベーススキーマ初期化処理を共有するようになり、リクエストが同時に到着した際の PostgreSQL の型重複エラーを防止します。初期化に失敗した場合は再試行できます。

## インストール可能なリポジトリファイルのみをパッケージ化

モジュールマニフェストは、リポジトリのシンボリックリンクをダウンロード対象ファイルとして記載しなくなりました。リポジトリファイル API がシンボリックリンクのパスを提供できない場合のインストール失敗を防止します。

## コミット

- [96d40aa](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96d40aac42fe25c75fa02a0f2bb224896bc3f450)
- [cf6e6b1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/cf6e6b10f2c61e7757d9513db88a84a9a0a65f7f)
