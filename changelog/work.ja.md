# 信頼性の高いインストールと有効化前の設定

**機能ブランチ:** work

## 有効化前に設定可能

Nextcloud Whiteboard は、モジュールが無効な間に設定ルートの読み込みを妨げる可能性がある必須のゲートウェイ依存関係を宣言しなくなりました。実行時の連携では、引き続き宣言済みの Cognis ケイパビリティを使用します。

## インストール可能な整合性インベントリ

パッケージファイルのインベントリはインストール可能な通常ファイルを対象とし、モジュールインストーラーがダウンロードできないリポジトリ専用リンクを除外するようになりました。

## 貢献者向け手順のシンボリックリンクを維持

貢献者向け手順は正規のリポジトリ手順へのリンクを維持し、ダウンロード用モジュールインベントリではリポジトリ専用のリンクを意図的に除外します。

## リポジトリのシンボリックリンクを要求せずにインストール

ダウンロード用マニフェストから貢献者向け手順のシンボリックリンクを除外しました。リポジトリファイル API ではインストール可能なモジュールファイルとして提供されないためです。リポジトリ内のシンボリックリンク自体は変更していません。

## コミット

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)
