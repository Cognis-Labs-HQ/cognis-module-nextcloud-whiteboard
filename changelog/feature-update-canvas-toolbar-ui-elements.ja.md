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

## 正確な共同編集カーソルと選択解除

キャンバスの消去またはオブジェクトの削除時に、対応するローカル選択とリモート選択をすべて解除します。キャンバス独自の共同編集カーソルをより頻繁に更新し、移動中と入力中を切り替え、描画・入力・サイズ変更中はリアルタイム表示を優先します。

## 保存状態の安定したレイアウト

ツールバーで翻訳済みの保存済みピルの幅を常に確保し、確認アニメーションの表示時に隣接する操作部品が移動しないようにしました。

## ビューポートに収まるキャンバス

ホワイトボードのグリッドとカードを、親要素の空き領域と利用可能な動的ビューポート高のうち小さい方に制限しました。キャンバスによる文書スクロールを防ぎ、無限パン領域で引き続き移動できます。

## コミット

- [5359a44](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5359a44d3a62ae2e05175f96e4f1271802f54544)
- [4affd1e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4affd1ea400a8e2765418394c70af70997330fd8)
- [44cca91](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/44cca91a6dbf3e17f9a28e033e4dd0b9f7d8a631)
- [99ede14](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/99ede14d59284b809d724052c202396f9a810a94)
- [0e906e8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0e906e8b690c1274f9e3f0689cfbe5205a530097)
- [d7d09ed](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d7d09edc43bf57ef9fd16657aee467061ed1230d)
- [e80c294](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/e80c2945c9cced41d4b17faed29aef817b3455d8)
- [4c190bf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4c190bf57de58f5f23972b1fa56feeb53d590bfa)
