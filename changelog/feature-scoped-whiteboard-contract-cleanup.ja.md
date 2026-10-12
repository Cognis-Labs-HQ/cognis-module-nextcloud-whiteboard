# キャンバス連携とライフサイクルを分離

**機能ブランチ:** feature-scoped-whiteboard-contract-cleanup

## 公開表示契約

ブラウザーはホストが初期化した ctx から `whiteboard:uiGateway` を取得します。`createCanvas({title, participantHandles})` と `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` は `{whiteboardId}` を返します。`requestCanvasPage({signal})` は Component Page の記述子を、`openCanvas({whiteboardId, elementId, signal})` はウィンドウハンドルを返します。呼び出し元は自身のマウント先を指定し、終了時にハンドルを破棄します。Whiteboard がルート識別、表示設定、通信トークンと寿命を管理し、連携側はそれらを再構成しません。各マウントには正確なキャンバス ID が必要です。

## 所有するアクションと確実な終了処理

有効なモジュールの非同期 Store アクションは、ctx を通じて所有する `nextcloud-whiteboard:*` Flow の `initialize-store` と `execute-action` 段階を実行します。結果の欠落と無効な Flow はエラーになります。ホストは無効なモジュールの Flow を登録しないため、無効時の設定は注入された Store を直接使います。変更前に認証と検証を行い、内部 Store 呼び出しはトランザクションを維持します。ボード削除と全データ削除は子テーブル優先の共通カタログを使用し、全削除は失敗時にロールバックします。

画面移動は通信検査と保留中のシーン処理を中止します。古いセッションやスクリプト応答は離れたキャンバスを再表示できません。検査は成功、失敗、中止のいずれでも Socket、Listener、Timer とスクリプトハンドルを解放します。Page Composer のスタイルはホストが管理します。

## コミット

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
