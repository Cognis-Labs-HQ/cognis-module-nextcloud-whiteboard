# 信頼性の高い共同編集とテキスト書式

**機能ブランチ:** work

## 共同編集者の操作状態を保持

キャンバス要素が選択されていない場合でも、描画中、押下中、入力中の状態が他の共同編集者に伝わるようになりました。

## テキストのフォントと編集の一貫性を維持

テキストツールバーはキャンバスのフォントで初期化され、1つのテキストスタイルを変更しても、選択したテキスト要素の他のスタイル属性を上書きしなくなりました。

## キャンバスコードの保守性を向上

キャンバスのソースは読みやすい改行構造を維持し、元に戻す・やり直す状態の管理を、独立してテストされた専用モジュールへ委譲します。

## キャンバスソースの間隔を復元

キャンバスのインポート、関数、コントローラー、返却される API の間を再び空行で区切り、意図された読みやすい構造を維持します。

## コミット

- [b4408bd](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b4408bd9f834536b0e8ed31d84c81f3710bb8439)
- [d5ba8ae](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d5ba8aee43d16ca53d28f5a64551fd2c334b39bc)
- [e132015](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/e13201553ad7c13c1fed8d5796db558f05b35cd9)
