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

## 以前の Whiteboard をパネル内に保持

以前の Whiteboard 一覧が開始パネルの残りの行を使用し、一覧の件数にかかわらず縦方向にスクロールするようになりました。Grid の最小サイズとパネルのオーバーフロー制限により、低いコンポーネントウィンドウでもボード行が角丸パネル内に収まり、安定したスクロールバー領域によって横方向のレイアウト移動も防ぎます。

## 重複する履歴ポップアップを削除

開始パネルには以前の Whiteboard が直接選択できる行としてすでにすべて表示されるため、重複する Whiteboard 履歴ボタンと操作できないポップアップを削除しました。アクティブな Canvas のツールバーからも同じ行き止まりのポップアップを取り除き、未定義の Popup Capability エラーと未使用のコード、文字列、スタイル、アイコンを解消しました。

## Jitsi Whiteboard の検証を復元

モジュールは、宣言済みの `whiteboard:fetchBoardData` および `whiteboard:membership` Capability を、初期化済み API インスタンスから直接公開するようになりました。Manifest には有効化テストとウィンドウ生成の Contribution も宣言します。未宣言の実装ファサード `whiteboard:api` は公開も参照もしないため、Jitsi Meet が検証プロバイダーを検出する前にブートストラップが中断される問題を防ぎます。

## 保存済み Whiteboard をより多く表示

保存済み Whiteboard 一覧は、縦スクロールが始まるまで従来の最大高さの 2 倍まで広がるようになりました。低いウィンドウでのオーバーフロー制限を維持しながら、最近のボードを一度により多く表示できます。

## Jitsi サーバー契約を API プロバイダーとともに公開

Jitsi 向けの `whiteboard:fetchBoardData`、`whiteboard:membership`、`whiteboard:deleteCanvas` Capability を、Whiteboard API プロバイダーの生成時にまとめて提供するようになりました。Bootstrap は UI と API の登録だけを初期化し、最新の Jitsi Meet 統合構造に合わせます。これにより、Whiteboard の直接ルートが利用できる一方で検証契約だけが欠落する状態を防ぎます。

## 実績のある Jitsi プロバイダー構成を復元

API 登録は初期化済み Whiteboard API を Bootstrap に直接返し、Bootstrap が Jitsi Meet 用の確立済み 4 つの `whiteboard:` 契約を直ちに公開するようになりました。一時的な内部 Capability の登録や参照を行わないため、スコープ付きホストコンテキストから `nextcloud-whiteboard:api` を解決していたことによる有効化エラーを解消します。

## 正規の Whiteboard 所有者 ID を公開

ボード検証は、保存済み Nextcloud ハンドルに加えて `createdByAccountId` を返すようになりました。この値は現在の Social Profile ID Capability で解決され、Cognis PR #225 の正規外部アカウントモデルに適合します。`createdBy` は Nextcloud と既存の Jitsi のタイトル・作成者検証のために維持されます。

## Whiteboard UI 公開前にサーバープロバイダーを公開

Bootstrap は Whiteboard の UI Contribution を登録する前に、Jitsi 向けのすべてのサーバー Capability を公開するようになりました。登録例外時には Capability を特定した構造化サーバーログを記録し、ブラウザープロバイダーが現れる前に有効化を中止します。Cognis は所有者スコープの Contribution を Bootstrap 完了後に別のモジュールコンテキストへ公開するため、`getCapability` による即時の読み戻しは行いません。

## コミット

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
- [b622ea5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b622ea5b9fcc7b978a1287b68c9e96aeff3b1b9d)
- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
- [554d48f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/554d48fcd21fb08f5c08c9f902e011047bb0c8f5)
- [7c2d0f1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c2d0f1f067ff7b81985168133645d6863b790cc)
- [434d564](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/434d56417a6526813f6e6a5942c0e84f0d725c53)
- [b34069a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b34069ab3c09a29b4916517aee8e0fb757abcba4)
- [27a12c2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/27a12c2eacbf2354bd02a58818bcd158fdc88210)
- [20350c7](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/20350c7fb16536c0a795cb1bd8c4f4b88239848f)
- [17a3387](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/17a3387f0845b0dfd067d10f8ae45d5cea6cc8c6)
- [a7ec3f9](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a7ec3f9084dfbbb45543e087ca9931ca0a970712)
- [17d692b](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/17d692b66644d9cde959ac1728d62efa8d67c3a7)
- [d2c85fc](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d2c85fcc18c0f5eae4dd57de71d12ca5ecca5715)
- [4e77310](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4e77310afdfd9633870a10aeb8358b9f820d1459)
- [f32d660](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f32d66062e536f658767dd9a2d6768087c252e8c)
- [b56afbd](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b56afbd44570e6761d23c845abb8603f47b7ee79)
- [4176de7](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4176de76b0c457180096d97b4fc675f8b8d8403e)
- [60bc825](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/60bc825982b5388099fa332defa37a8b64759f4d)
