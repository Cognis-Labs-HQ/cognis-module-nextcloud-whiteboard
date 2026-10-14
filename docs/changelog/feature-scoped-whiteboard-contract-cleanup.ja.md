# キャンバス連携とライフサイクルを分離

**機能ブランチ:** feature-scoped-whiteboard-contract-cleanup

## 公開表示契約

ブラウザーはホストが初期化した ctx から `whiteboard:uiGateway` を取得します。`createCanvas({title, participantHandles})` と `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` は `{whiteboardId}` を返します。`requestCanvasPage({signal})` は Component Page の記述子を、`openCanvas({whiteboardId, elementId, signal})` はウィンドウハンドルを返します。呼び出し元は自身のマウント先を指定し、終了時にハンドルを破棄します。Whiteboard がルート識別、表示設定、通信トークンと寿命を管理し、連携側はそれらを再構成しません。各マウントには正確なキャンバス ID が必要です。

## 所有するアクションと確実な終了処理

有効なモジュールの非同期 Store アクションは、ctx を通じて所有する `nextcloud-whiteboard:*` Flow の `initialize-store` と `execute-action` 段階を実行します。結果の欠落と無効な Flow はエラーになります。ホストは無効なモジュールの Flow を登録しないため、無効時の設定は注入された Store を直接使います。変更前に認証と検証を行い、内部 Store 呼び出しはトランザクションを維持します。ボード削除と全データ削除は子テーブル優先の共通カタログを使用し、全削除は失敗時にロールバックします。

画面移動は通信検査と保留中のシーン処理を中止します。古いセッションやスクリプト応答は離れたキャンバスを再表示できません。検査は成功、失敗、中止のいずれでも Socket、Listener、Timer とスクリプトハンドルを解放します。Page Composer のスタイルはホストが管理します。

## パッケージリビジョンを使うブラウザー入口

Whiteboard は Manifest のインストール済みパッケージリビジョンを登録するブラウザー入口 URL に付けます。Cognis のビルドが同じでも、Whiteboard の更新後は Provider とキャンバスの入口に新しい URL が与えられます。ブラウザー契約テストは実際のローカルモジュールグラフをリンクし、名前付き Export の欠落をリリース前に検出します。有効なモジュールを更新した後、開いているページを再読み込みしてブラウザーコンテキストに新しい Provider を読み込んでください。

## 無限キャンバスの移動をローカルに保つ

埋め込みキャンバスは枠なしの Composer ビューポートを使用し、コンテンツのスクロールを無効にします。マウスの中央ボタンでドラッグするとローカルの表示位置だけが変わり、シーン変更の配信、スナップショット保存、同期状態の変更は行いません。

## 埋め込みキャンバスをコンテナーに合わせる

埋め込みキャンバスのサイズ封じ込めにより、以前のビットマップの高さが枠なしコンポーネントウィンドウを拡大することを防ぎます。ツールバーとキャンバスは実際のコンテナーの高さを共有し、切り取りや縦スクロールを生じさせません。Chromium の回帰テストで大きすぎるビットマップのマウントと繰り返しのサイズ変更を確認します。Jitsi 固有やページシェルのスタイルは不要です。

## コンポーネントページ契約で埋め込みレイアウトを指定する

`openCanvas` はコンポーネントページの生成リクエスト直下で `borderless: true` を指定します。キャンバスのコンテキスト内に入れたレイアウト指定はホストに読み取られず、親領域に合わせるサイズ指定が付かないため、サイズを封じ込めたキャンバスが縮んでいました。コンテキストにはキャンバスの識別情報とモードだけを残します。Gateway テストは公開リクエストと枠なしウィンドウを確認し、Chromium 回帰テストは実際の Gateway と描画を入れ子の標準モード領域で実行します。

## テンプレートの開発指針

ドメイン固有の規則を保持して AGENTS.md を外部モジュールテンプレートに同期します。リリース文書を標準の配置に移し、過去の内容と永久的なモジュール識別情報を保持します。

## 標準構成と所有範囲を守る統合

テンプレートの指針、ドメイン別ルート、翻訳された統合文書、実行可能な構成チェック、最終パッケージハッシュを同期します。公開URLとモジュール識別子は維持します。ブラウザーの提供機能は担当ホストのライフサイクル契約に従います。

## Cognis とプロバイダーの画像

Marketplace バナーを Cognis とプロバイダーの構成へ置き換え、ブランドを中央の表示領域に収めます。既存のアイコンは維持します。

## Marketplace の説明を統一する

Marketplace のメタデータに短い操作概要と具体的な機能説明を使用し、翻訳の意味を揃えます。

## キャンバスの管理と参照元

管理 → ホワイトボードでは、すべてのキャンバスと所有者、参照元、使用中のユーザー、更新日時を表示します。「すべてのキャンバス」「使用中」「連携キャンバス」のフィルターで絞り込めます。管理者による削除は確認が必要で、共有を取り消してから保存内容、参加状態、参加者のアクセス権、ユーザーのコピーを削除します。アクセストークンは一覧に公開しません。`whiteboard:sourceBinding` は `{whiteboardId, actorAccountId, sourceType, sourceId}` を受け取る `bind` と `release` を提供します。参照元を変更できるのは所有者だけです。条件付き更新により別の参照元は `source_conflict` で拒否し、同じ参照元の再設定は成功します。解除は指定の参照元に一致する場合だけ行い、古い重複参照の整理にも使用します。登録済みの保存処理フローを使用します。連携側は独自の参照元IDを渡し、Whiteboardの内部保存や描画機構を参照しません。

## スコープ付きブラウザー操作と管理者権限の検証

キャンバスの参照元変更と削除は、公開契約 `auth:accountStore` で検証された管理者も実行できます。キャンバスの記録を削除する前に、すべての共有所有者の共有を取り消します。登録済みサーバー操作の名前は、変更されないモジュールプレフィックス以降をcamel caseにします。

## コミット

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
- [a42cff8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a42cff8c865ae0388fd3ded03d2e957e9ff5dd3e)
- [a79203e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a79203ed13a22bfe77ae59c32efe5b43b331c559)
- [c818b40](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c818b40db5010cb220cb54ffd23bc45940539f44)
- [05e253c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/05e253c37054f54197c4f79511f722ef96df4631)
- [6ea9026](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6ea902628f55686585e8f709ff0ddf79a1632a83)
- [080abb5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/080abb5cb88fee15491b2ef17787dfb7226890c3)
- [0db0f41](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0db0f410182c2c8d897360bc818e670ae391130e)
- [bd1f069](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/bd1f069c5bc597469c0b06cc7377ab4b837d6902)
- [b35f85d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b35f85daa2fd905fa6cf4efe2c1fc092f5c7bee5)
