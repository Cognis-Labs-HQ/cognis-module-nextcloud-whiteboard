# Whiteboard を構造変更に適合

**機能ブランチ:** feature-align-module-with-structural-changes

## 所有者を追跡できるモジュール提供機能を使用

Nextcloud Whiteboard は、公開ケイパビリティと保護された共有フロー拡張を、スコープ化されたモジュールコンテキストを通じて登録するようになりました。これにより Cognis は提供機能の所有権を適用し、モジュールの無効化またはアンインストール時にすべての登録を確実に削除できます。

## 安定した Whiteboard ゲートウェイ契約を公開

サーバー統合では、`whiteboard:fetchBoardData`、`whiteboard:membership`、`whiteboard:deleteCanvas` を含む既存の `whiteboard:` Capability 名前空間を引き続き使用します。これにより、文書化されたモジュール API と一致し、Jitsi Meet のマッピング検証とメンバーシップ同期が復元されます。

## 名前空間をまたぐ公開を明示的に宣言

Cognis では、モジュール ID の名前空間外に公開するモジュールに特権が必要になりました。そのためマニフェストは、既存の共有 `whiteboard:` ゲートウェイ契約を維持する目的に限定して特権を要求します。Capability の登録は引き続きスコープ化されたモジュールコンテキストを通じて所有者追跡されます。

## 有効化時の重複登録を回避

ウィンドウ起動機能の所有者追跡対象の公開元を一つにし、共有フックをスコープ化されたコンテキストごとに一度だけ登録するようにしました。これにより、ケイパビリティやフローの競合によってモジュールの有効化が中断されることを防ぎます。

## 再有効化後にファイル名前空間を再利用

有効化時に、登録を試みる前に既存の Whiteboard ファイル名前空間を確認するようになりました。ファイルゲートウェイが無効化と有効化の間も保持する名前空間は再利用され、新規インストールでは引き続き一度だけ登録されます。

## 非表示になった保存ラベルの領域を解放

保存確認が消える際に、テキスト領域、内側の余白、要素間の間隔も折りたたむようになりました。ラベル幅の見えない空白を残さず、成功チェックがツールバーの端へ滑らかに戻ります。

## ローカライズされたラベルのアニメーションを維持

保存テキストをオーバーフローに対応したアニメーション領域で囲み、対応するすべての言語のラベルが隣接する操作部品を切り取らずに展開および折りたためるようにしました。

## ブラウザーゲートウェイを一度だけ公開

Nextcloud Whiteboard は `whiteboard:uiGateway` を一つの専用 Capability Provider だけで宣言するようになりました。ナビゲーションバーは同じ Provider を宣言またはインポートしなくなり、所有者保護された UI Registry での重複登録を防ぎます。

## Jitsi Meet コントロールを復元

バックエンドが名前空間付きサーバー Capability を検出した後、Jitsi Meet は Whiteboard の Canvas Factory を確実に読み込めるようになり、ミーティングウィンドウの Whiteboard ボタンと共有 Canvas の作成が復元されます。

## 一つの Capability 名前空間を一貫して使用

内部モジュール API、有効化テスト、ウィンドウ起動、埋め込み、ボード検証、メンバーシップ、削除、ブラウザーゲートウェイは、すべて `whiteboard:` Capability 名前空間を使用するようになりました。モジュール ID、ルートパス、フローフック ID、CLI コマンド名は Capability 契約ではなくモジュール自体を識別するため、`nextcloud-whiteboard` のままです。

## コミット

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
- [b622ea5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b622ea5b9fcc7b978a1287b68c9e96aeff3b1b9d)
- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
- [554d48f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/554d48fcd21fb08f5c08c9f902e011047bb0c8f5)
- [7c2d0f1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c2d0f1f067ff7b81985168133645d6863b790cc)
- [434d564](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/434d56417a6526813f6e6a5942c0e84f0d725c53)
