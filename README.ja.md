# Nextcloud Whiteboard

[English](README.en.md) · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · **日本語**

Nextcloud を基盤とし、Cognis のアクセス制御と統合された共同ホワイトボードです。このリポジトリは自己完結型の Cognis 外部モジュールです。

## はじめに

モジュールマーケットプレイスからインストールするか、構成済みの外部モジュールディレクトリに配置します。モジュールを有効化し、**Nextcloud Whiteboard Settings** を開いて、Whiteboard サーバー URL、画像アップロード上限、共有 API キーを設定します。

ユーザーは `/whiteboards` でボードを作成・選択し、`/whiteboard?id=<board-id>` で共同編集できます。所有者はホストの共有ダイアログから読み取りまたは書き込みアクセスを付与できます。

## コントリビューター向けチェック

```sh
npm install
npm run lint
npm test
npm run check:manifest
git diff --check
```

構成、Capability、ルート、セキュリティ境界、運用方法については [`docs/standard.ja.md`](docs/standard.ja.md) を参照してください。
