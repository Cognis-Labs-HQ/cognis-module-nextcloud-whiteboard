# 使用例

Cognis で共同編集できる描画キャンバスを作成し、共有できます。

## 前提条件

管理者が Whiteboard サーバーと API キーを設定する必要があります。Cognis とブラウザーの両方からサーバーに接続でき、編集するボードへの書き込み権限が必要です。

## 使用例

Whiteboard を開いて New Board または保存済みボードを選びます。接続状態を確認してから、権限に応じて描画または閲覧します。

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

キャンバスの準備完了と書き込み権限は所有者が確認する別々の状態です。読み込み後の接続説明は全閲覧者が利用できます。描画と履歴は書き込みアクセスが必要で、読み取り専用の受信者にはパンとズームを案内します。利用できない編集・共有操作は経路とステップ数から除外します。

## 期待される結果

許可された参加者に共有ボードが表示されます。描画は同期され、表示位置の移動は自分の画面だけに反映されます。一時キャンバスの保存で保持されるコピーが作成されます。

## 問題の解決

準備に失敗した場合はサーバー接続、プロキシの WebSocket 対応、設定済みキーを確認します。閲覧専用では編集操作が表示されません。書き込み権限は所有者に依頼してください。
