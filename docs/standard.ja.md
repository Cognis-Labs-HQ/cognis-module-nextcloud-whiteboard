# Nextcloud Whiteboard モジュール

Nextcloud Whiteboard モジュールは、独立した Nextcloud Whiteboard Socket.IO サーバーを利用し、Cognis ユーザーにネイティブな共同描画キャンバスを提供します。構成、認可、永続化、共有、UI は Cognis が所有し、外部サーバーは認可済みのリアルタイムシーン更新だけを転送します。

## 使用例

**サービスを構成する**

モジュールを有効化し、**Nextcloud Whiteboard Settings** を開いて次を入力します。

- `https://whiteboard.example.com:3002` などの **Whiteboard Server URL**
- バイト単位の**画像アップロード上限**（`0` は貼り付け画像のアップロードを無効化）
- 短時間のセッショントークンを署名する、16 文字以上の共有秘密である **API キー**

保存時に値が検証され、必要なブラウザー接続用にサーバー origin が登録されます。`cognisctl nextcloud-whiteboard:ping` で稼働状態を確認し、管理者は `cognisctl nextcloud-whiteboard:whiteboards` でボードを一覧できます。

**ボードを開いて共有する**

ユーザーは `/whiteboards` でボードを作成または選択し、`/whiteboard?id=<board-id>` で編集します。`instantCanvas=1` を追加するとコンパクトな統合キャンバスになります。ツールバーは選択、フリーハンド、図形、矢印、テキスト、消しゴム、元に戻す・やり直す、色、線幅、画像貼り付け、履歴、名前変更、クリアに対応します。

所有者はツールバーからホストの共有ポップアップを開き、読み取りまたは書き込み権限を付与できます。アカウント受信者は直接ボードを開き、リンク受信者はホストの共有 Flow で解決され、付与された Capability だけを受け取ります。

既存の永続キャンバスには、使用中でも新しく招待されたユーザーを追加できます。任意の Provider メソッド `whiteboard:uiGateway.expandCanvasAccess` は要求されたプロフィールを検証し、所有者が認可された API を通じて、既存のアクセスを置き換えずに保存済みの編集者許可リストを拡張します。

**Capability で統合する**

他コンポーネントのルートをハードコードしたり内部実装をインポートしたりせず、公開 Capability を `ctx` から解決します。

```js
const getEmbedUrl = ctx.getCapability("whiteboard:getEmbedUrl");
const fetchBoardData = ctx.getCapability("whiteboard:fetchBoardData");
const spawnWhiteboardWindow = ctx.getCapability(
    "nextcloud-whiteboard:spawnWhiteboardWindow",
);

const url = getEmbedUrl(boardId, { instantCanvas: true });
const board = await fetchBoardData(boardId);
await spawnWhiteboardWindow({ whiteboardId: board.id });
```

ボード ID がなければ `getEmbedUrl` は `null` を返します。モジュール API が利用不能な場合や、呼び出し元に対象ボードへのアクセス権がない場合、非同期 Capability は失敗します。

## 技術仕様

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

- `GET` / `POST /config` は管理者構成を取得・更新します。
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
- `GET`、`POST`、`POST /share/delete` はボードアクセスを一覧・作成・削除します。

境界検証はリクエストサイズを制限し、識別子を正規化してからビジネスロジックの前に認可します。依存関係が利用不能なら service unavailable を返し、運用障害は安全な構造化メタデータで記録します。

### 永続化とリアルタイム動作

Cognis は `db:executor` Capability を通じて構成、ボード、アクセス、プレゼンス、スナップショットを保存します。画像は Files Capability から得たモジュール名前空間を使用します。ボード ID とトークンは暗号学的に安全に生成され、`Math.random` は使用しません。

クライアントは上限付き遅延で再接続し、タブが非表示の間はリアルタイム処理を停止し、シーンバージョンをマージし、非一時的変更を永続化し、プレゼンスを個別更新します。画像はバイト上限に従います。アンマウント時に Socket、Observer、イベントハンドラー、キャンバス資源を解放します。

### セキュリティと運用条件

本番環境では Whiteboard サーバーを HTTPS で提供し、API キーを秘密として保護してください。構成した origin は Cognis とユーザーのブラウザーの両方から到達可能で、リバースプロキシは WebSocket upgrade を許可する必要があります。セッション JWT には有効期限があるため時刻同期も必要です。

マニフェスト記載の公開 `ctx` Capability と Flow だけを使用してください。Cognis の Gateway・Adapter 内部をインポートせず、API キーをブラウザーへ公開せず、ホストルーターを迂回せず、未認証のモジュール API 呼び出しを作成しないでください。パッケージファイル変更後は `manifest.files` を再生成し、4 言語の文書とロケールを同期してください。
