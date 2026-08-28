# 信頼性の高いインストールと有効化前の設定

**機能ブランチ:** work

## 有効化前に設定可能

Nextcloud Whiteboard は、モジュールが無効な間に設定ルートの読み込みを妨げる可能性がある必須のゲートウェイ依存関係を宣言しなくなりました。実行時の連携では、引き続き宣言済みの Cognis ケイパビリティを使用します。

## 完全な整合性インベントリ

パッケージファイルのインベントリに貢献者向け手順が含まれるようになり、有効化時のチェックサム欠落による整合性警告を防止します。

## 貢献者向け手順のシンボリックリンクを維持

貢献者向け手順は正規のリポジトリ手順へのリンクを維持し、マニフェストツールはその有効なファイルリンクをたどって整合性チェックサムを生成および検証します。

## コミット

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)
