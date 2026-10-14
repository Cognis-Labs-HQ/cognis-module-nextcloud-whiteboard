# Nextcloud Whiteboard モジュール

Nextcloud Whiteboard モジュールは、独立した Nextcloud Whiteboard Socket.IO サーバーを利用し、Cognis ユーザーにネイティブな共同描画キャンバスを提供します。構成、認可、永続化、共有、UI は Cognis が所有し、外部サーバーは認可済みのリアルタイムシーン更新だけを転送します。

## 使用例

**サービスを構成する**

モジュールを有効化し、**Nextcloud Whiteboard Settings** を開いて次を入力します。

- `https://whiteboard.example.com:3002` などの **Whiteboard Server URL**
- バイト単位の**画像アップロード上限**（`0` は貼り付け画像のアップロードを無効化）
- 短時間のセッショントークンを署名する、16 文字以上の共有秘密である **API キー**

保存時に値が検証され、必要なブラウザー接続用にサーバー origin が登録されます。`cognisctl modules:nextcloud-whiteboard:ping` で稼働状態を確認し、管理者は `cognisctl modules:nextcloud-whiteboard:whiteboards` でボードを一覧できます。

**ボードを開いて共有する**

ユーザーは `/whiteboards` でボードを作成または選択し、`/whiteboard?id=<board-id>` で編集します。`instantCanvas=1` を追加するとコンパクトな統合キャンバスになります。ツールバーは選択、フリーハンド、図形、矢印、テキスト、消しゴム、元に戻す・やり直す、色、線幅、画像貼り付け、履歴、名前変更、クリアに対応します。

所有者はツールバーからホストの共有ポップアップを開き、読み取りまたは書き込み権限を付与できます。アカウント受信者は直接ボードを開き、リンク受信者はホストの共有 Flow で解決され、付与された Capability だけを受け取ります。

永続キャンバスのメンバーシップは、公開 CTX capability `whiteboard:membership` だけで制御します。`add` と `remove` 関数はキャンバス ID と正規の実行者およびユーザーのアカウント ID を受け取り、キャンバス所有者を認可して、参加者を一人ずつ変更します。

**Capability で統合する**

他コンポーネントのルートをハードコードしたり内部実装をインポートしたりせず、公開 Capability を `ctx` から解決します。

```js
const getEmbedUrl = ctx.getCapability("whiteboard:getEmbedUrl");
const fetchBoardData = ctx.getCapability("whiteboard:fetchBoardData");
const spawnWhiteboardWindow = ctx.getCapability(
    "whiteboard:spawnWhiteboardWindow",
);

const url = getEmbedUrl(boardId, { instantCanvas: true });
const board = await fetchBoardData(boardId);
// board.createdByAccountId は正規の Cognis アカウント ID です。
await spawnWhiteboardWindow({
    title: "Shared canvas",
    createdBy: ownerHandle,
    participants: participantHandles,
});
```

ボード ID がなければ `getEmbedUrl` は `null` を返します。モジュール API が利用不能な場合や、呼び出し元に対象ボードへのアクセス権がない場合、非同期 Capability は失敗します。

## 技術仕様

### Provider が所有する表示とアクション Flow

ブラウザーはホストが初期化した ctx から `whiteboard:uiGateway` を取得します。`createCanvas({title, participantHandles})` と `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` は `{whiteboardId}` を返します。`requestCanvasPage({signal})` は Component Page の記述子を、`openCanvas({whiteboardId, elementId, signal})` はウィンドウハンドルを返します。呼び出し元は自身のマウント先を指定し、終了時にハンドルを破棄します。Whiteboard がルート識別、表示設定、通信トークンと寿命を管理し、連携側はそれらを再構成しません。各マウントには正確なキャンバス ID が必要です。 プロバイダーはホストの生成契約の直下で枠なし表示を指定し、キャンバスのコンテキストには識別情報とモードだけを渡します。

有効なモジュールの非同期 Store アクションは、ctx を通じて所有する `nextcloud-whiteboard:*` Flow の `initialize-store` と `execute-action` 段階を実行します。結果の欠落と無効な Flow はエラーになります。ホストは無効なモジュールの Flow を登録しないため、無効時の設定は注入された Store を直接使います。変更前に認証と検証を行い、内部 Store 呼び出しはトランザクションを維持します。ボード削除と全データ削除は子テーブル優先の共通カタログを使用し、全削除は失敗時にロールバックします。

画面移動は通信検査と保留中のシーン処理を中止します。古いセッションやスクリプト応答は離れたキャンバスを再表示できません。検査は成功、失敗、中止のいずれでも Socket、Listener、Timer とスクリプトハンドルを解放します。Page Composer のスタイルはホストが管理します。

Whiteboard は Manifest のインストール済みパッケージリビジョンを登録するブラウザー入口 URL に付けます。Cognis のビルドが同じでも、Whiteboard の更新後は Provider とキャンバスの入口に新しい URL が与えられます。ブラウザー契約テストは実際のローカルモジュールグラフをリンクし、名前付き Export の欠落をリリース前に検出します。有効なモジュールを更新した後、開いているページを再読み込みしてブラウザーコンテキストに新しい Provider を読み込んでください。

埋め込みキャンバスは、コンテンツのスクロールを無効にした枠なしのコンポーザー表示領域を使います。キャンバス固有の大きさを埋め込み領域のサイズ計算から切り離し、会議ウィンドウの縮小・拡大後もツールバーと描画領域がコンテナー内に収まるようにします。マウスの中央ボタンでドラッグするとローカルの表示位置だけが変わり、シーン変更の配信、スナップショット保存、同期状態の変更は行いません。

### アーキテクチャとライフサイクル

`bootstrap.js` は UI と API を登録し、公開 Capability を提供して `bootstrap-platform` を拡張します。UI はホストの Page Composer とルーターを使用し、API はボードメタデータ、スナップショット、プレゼンス、構成、セッション生成を所有します。有効化時に `/whiteboards`、`/whiteboard`、静的アセット、ナビゲーション、API、Capability、共有 Flow フックが登録され、無効化時にモジュールスコープの登録が削除されます。

ブラウザーは認可された単一ボード用の短時間 JWT を受け取り、構成済み Socket.IO エンドポイントへ直接接続します。管理者 API キーはサーバー内に留まります。Cognis は再接続後の復元用にシーンスナップショットを保存し、Socket.IO はライブ更新とプレゼンスを配信します。

### 構成と検証

マニフェストは、ローカライズされたラベルを持つ `serverUrl`、`imageUploadMaxBytes`、`apiKey` を宣言します。URL は HTTP または HTTPS でなければなりません。アップロード上限は非負数に正規化されます。指定する API キーは 16 文字以上が必要で、更新時に省略すると保存済み秘密が維持されます。不正なフィールドには内部情報を含まない安全な検証応答を返します。

preflight エンドポイントはセッション開始前に構成、HTTP 到達性、WebSocket 認可を検査します。enable-test は管理者専用で、必要な依存関係と外部サービスが利用可能かを報告します。

### 認可と共有

すべてのボード操作は `auth:requireAuth` で認証します。所有者はボード名と参加者リストを管理でき、参加者は保存されたロールに応じたアクセス権を得ます。比較前にプロフィールハンドルを正規化し、非公開プロフィールを暗黙に公開しません。

利用可能な場合、モジュールは `mint-share-token`、`resolve-share-token`、`construct-share-page`、`revoke-share-token` を拡張します。トークン発行者を認可する前にリソースを検証し、共有ゲストによる共有の作成・取消を拒否し、`whiteboard` リソースだけを解決し、ホストの公開共有レンダラー契約を使用します。

### API ルート

ルートの基点は `/api/v1/modules/nextcloud-whiteboard` です。

- `GET` / `PUT` / `DELETE /config` は管理者構成を取得・更新します。
- `GET /ping` はモジュールの稼働状態を返します。
- `POST /admin/enable-test` は管理者向け有効化検査を実行します。
- `GET /whiteboards` はアクセス可能なボードを返し、管理者 scope では全件を返します。
- `POST /whiteboards/spawn` はボードを作成し、`GET /whiteboards/launch` は起動データを返します。
- `POST /whiteboards/preflight` は外部サーバーを検査します。
- `GET /whiteboards/session` はボードを認可して接続情報を返します。
- `POST /whiteboards/elements` はシーンスナップショットを保存します。
- `GET` / `POST /whiteboards/presence` はプレゼンスを取得・更新します。
- `POST /whiteboards/rename` は所有ボードの名前を変更します。
- `GET` / `POST /whiteboards/images` は名前空間付き画像を取得・アップロードします。
- `GET /share`、`POST /share`、`POST /share/delete` はボードアクセスを一覧・作成・削除します。

境界検証はリクエストサイズを制限し、識別子を正規化してからビジネスロジックの前に認可します。依存関係が利用不能なら service unavailable を返し、運用障害は安全な構造化メタデータで記録します。

### 永続化とリアルタイム動作

Cognis は `db:executor` Capability を通じて構成、ボード、アクセス、プレゼンス、スナップショットを保存します。画像は Files Capability から得たモジュール名前空間を使用します。ボード ID とトークンは暗号学的に安全に生成され、`Math.random` は使用しません。

クライアントは上限付き遅延で再接続し、タブが非表示の間はリアルタイム処理を停止し、シーンバージョンをマージし、非一時的変更を永続化し、プレゼンスを個別更新します。画像はバイト上限に従います。アンマウント時に Socket、Observer、イベントハンドラー、キャンバス資源を解放します。

### セキュリティと運用条件

本番環境では Whiteboard サーバーを HTTPS で提供し、API キーを秘密として保護してください。構成した origin は Cognis とユーザーのブラウザーの両方から到達可能で、リバースプロキシは WebSocket upgrade を許可する必要があります。セッション JWT には有効期限があるため時刻同期も必要です。

マニフェスト記載の公開 `ctx` Capability と Flow だけを使用してください。Cognis の Gateway・Adapter 内部をインポートせず、API キーをブラウザーへ公開せず、ホストルーターを迂回せず、未認証のモジュール API 呼び出しを作成しないでください。パッケージファイル変更後は `manifest.files` を再生成し、4 言語の文書とロケールを同期してください。

### キャンバス統合のライフサイクル

ブラウザーの提供スクリプトは`mountProvider(ctx)`内でのみ`whiteboard:uiGateway`を公開します。`nextcloud-whiteboard:requestCanvasPage`、`openCanvas`、`createCanvas`、`createDisposableCanvas`の各フローはスコープ付きUIコンテキストを通じて実行します。無効化すると作成中の通信を中断し、古いゲートウェイ参照を拒否します。再有効化では同じキャッシュ済みスクリプトを再マウントします。埋め込みキャンバスのマークアップは`ui/templates/`に置き、Playwrightを使わずChromium/CDPでサイズを検証します。

### 開発者向け構成とホストの責任範囲

新しいモジュールは[cognis-module-template](https://github.com/Cognis-Labs-HQ/cognis-module-template)から作成し、このリポジトリでは`AGENTS.md`に記載されたテンプレート版の指針に従います。`bootstrap.js`はライフサイクルの調整、`api/index.js`はctx依存関係の接続、`api/routes/<domain>/index.js`はHTTP処理、`api/reuse/`は再利用するサーバーコードを担当します。ブラウザー機能は`ui/`、スタイルは`ui/styles/`、再利用するマークアップは`ui/templates/`、翻訳された文書は`docs/index.<locale>.md`に配置します。過去のリリース記録は`docs/changelog/`に置き、パッケージのハッシュ対象から除外します。対応しない任意の領域は作成しません。

公開ctx機能と宣言されたフローを利用し、Cognis内部や他のモジュールをインポートしないでください。ダッシュボードの機能・ナビゲーション提供スクリプトは`mountProvider(scopedUiCtx)`を公開し、所有するリソースの終了処理を返します。インポート時にモジュールの動作を登録してはいけません。ホストは無効化時に機能、フローフック、リスナー、提供状態を解除し、再有効化時にキャッシュ済みスクリプトを再マウントします。設定・管理画面のファクトリーと認証フッターの記述子は、それぞれの公開ホスト契約に従います。独立したテスト用実装で契約を検証し、構成チェックを実行し、最後のパッケージ変更後にハッシュを更新して、公開前にlint、テスト、マニフェスト検証を実行してください。

Marketplace バナーは Cognis とプロバイダーのブランドを中央の切り抜きに強いレイアウトで組み合わせ、既存のプロバイダーアイコンを維持します。

## キャンバスの管理と参照元

管理 → ホワイトボードでは、すべてのキャンバスと所有者、参照元、使用中のユーザー、更新日時を表示します。「すべてのキャンバス」「使用中」「連携キャンバス」のフィルターで絞り込めます。管理者による削除は確認が必要で、共有を取り消してから保存内容、参加状態、参加者のアクセス権、ユーザーのコピーを削除します。アクセストークンは一覧に公開しません。`whiteboard:sourceBinding` は `{whiteboardId, actorAccountId, sourceType, sourceId}` を受け取る `bind` と `release` を提供します。参照元を変更できるのは所有者だけです。条件付き更新により別の参照元は `source_conflict` で拒否し、同じ参照元の再設定は成功します。解除は指定の参照元に一致する場合だけ行い、古い重複参照の整理にも使用します。登録済みの保存処理フローを使用します。連携側は独自の参照元IDを渡し、Whiteboardの内部保存や描画機構を参照しません。

キャンバスの参照元変更と削除は、公開契約 `auth:accountStore` で検証された管理者も実行できます。キャンバスの記録を削除する前に、すべての共有所有者の共有を取り消します。登録済みサーバー操作の名前は、変更されないモジュールプレフィックス以降をcamel caseにします。
