# 信頼性の高いインストールと有効化前の設定

**機能ブランチ:** work

## 有効化前に設定可能

Nextcloud Whiteboard は必要な Cognis コアコンポーネントと外部モジュールの依存関係を分離し、Cognis が依存関係の種類ごとに適切なライフサイクル規則を適用できるようにしました。

## インストール可能な整合性インベントリ

パッケージファイルのインベントリはインストール可能な通常ファイルを対象とし、モジュールインストーラーがダウンロードできないリポジトリ専用リンクを除外するようになりました。

## 貢献者向け手順のシンボリックリンクを維持

貢献者向け手順は正規のリポジトリ手順へのリンクを維持し、ダウンロード用モジュールインベントリではリポジトリ専用のリンクを意図的に除外します。

## リポジトリのシンボリックリンクを要求せずにインストール

ダウンロード用マニフェストから貢献者向け手順のシンボリックリンクを除外しました。リポジトリファイル API ではインストール可能なモジュールファイルとして提供されないためです。リポジトリ内のシンボリックリンク自体は変更していません。

## 依存関係メタデータを Cognis に合わせる

コアコンポーネントの UUID は `requires` に維持し、新しい `hardDependencies` と `softDependencies` フィールドによって Nextcloud Whiteboard に外部モジュールのインストール依存関係がないことを明示します。

## コミット

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)

- [608dbd1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/608dbd18c9b362450d603f7e5d73585b22bf031d)
