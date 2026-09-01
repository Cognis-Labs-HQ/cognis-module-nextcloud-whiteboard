# 洗練されたホワイトボードツールバー

**機能ブランチ:** feature-update-canvas-toolbar-ui-elements

## テーマに対応した明瞭な描画操作

ツールバーの文字記号を、`ui/reuse/assets/`に保存され、ライト・ダーク両テーマの色を継承する統一されたSVGアイコンに置き換えました。丸いカラーピッカーを大きくし、消去操作をキャンバスタイトルの隣へ移動しました。

## より使いやすいテキスト書式

テキストツールの選択中にフォントファミリーとサイズを指定できるようにし、フローティング書式ツールバーの配置を均等に整えました。

## コンポーネント用キャンバスへの集中

コンポーネントウィンドウで開いたホワイトボードでは、新規作成と履歴の操作を非表示にしました。

## リアルタイム共同編集のフィードバック

オブジェクトのアンカーポイントでポインターカーソルを表示します。削除されたオブジェクトのリモート選択は直ちに解除され、共同編集者の表示でオブジェクト操作中と入力中を区別できます。

## キャンバス消去の確認を復元

消去ボタンをネイティブなボタン要素に変更し、ツールバーで安定したイベント委譲を使用することで、ツールバー更新後も確認ダイアログが確実に開くようにしました。

## コミット

- [5359a44](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5359a44d3a62ae2e05175f96e4f1271802f54544)
- [4affd1e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4affd1ea400a8e2765418394c70af70997330fd8)
- [44cca91](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/44cca91a6dbf3e17f9a28e033e4dd0b9f7d8a631)
- [99ede14](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/99ede14d59284b809d724052c202396f9a810a94)
- [0e906e8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0e906e8b690c1274f9e3f0689cfbe5205a530097)
