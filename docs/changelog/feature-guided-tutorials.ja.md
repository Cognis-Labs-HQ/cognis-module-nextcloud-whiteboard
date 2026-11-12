# ガイド付きチュートリアル

**機能ブランチ:** feature-guided-tutorials

## ページのガイド

ボード選択、描画、キャンバスの移動、履歴、保存、共有と、管理者専用のキャンバス管理・設定を案内します。

ホストは説明、矢印、強調表示、アクセシビリティ、共通のフローティング操作メニューを担当します。初回は常に「次へ」を表示し、中止とスキップは表示しません。再生時の中止には `btn-cancel` を使います。完了はブラウザー内でアカウント別に保存します。移動、アクセス喪失、プロバイダー解除でセッションを終了し、マウント失敗では登録を取り消します。

## 内容を表すチュートリアルのキー

チュートリアルの手順に使う翻訳キーと対象の識別子は、ガイド内の順番ではなく内容を表します。同じキーを対応する四つの言語すべてで提供します。

## ステップごとに次へ進む強調を指定

各ステップで `highlightNext` を明示します。「次へ」や「完了」が必要な説明では有効にし、操作や待機条件で進む練習では無効にします。動きを減らす設定では静的な枠を表示します。

すべての UI コンポーネントにチュートリアルを用意します。開発ガイドラインでは、利用者の目的に沿う操作説明と、機能や UI 動作の変更に伴う既存チュートリアルの見直しを求めます。

## 具体的な対象と分岐の再開始

キャンバス削除の説明では、表示中の削除ボタンを強調します。チュートリアルのセクション内で利用可能な最初の対象を選び、対象がない場合はステップを飛ばします。

## 表示されるチュートリアル対象

強調する領域と「次へ」の強調を明示します。

## 共通のフローティングメニュー待ち行列

メニューはホスト共通の待ち行列とコンポーネントの寿命に従います。

## 復旧操作の説明

対象がない画面では「次へ」と最初からやり直す操作を提供し、再実行では中止も選べます。

## 目的の明確なガイド

表示順に沿って異なる可視操作を説明します。共通指針は画面状態の検出、安定した例、空の状態、条件付き分岐、ライフサイクルの後処理を扱います。再実行操作と動きを減らす設定の文書をホストと一致させます。

## 翻訳カタログの統一

モジュールのメタデータとチュートリアルの翻訳キーは、小文字の単語をピリオドで区切ります。カタログの翻訳内容は維持し、周囲の XML と字下げを揃えます。厳格な名前空間検証により、翻訳キーのハイフンとアンダースコアを拒否します。モジュール ID、UUID、ケイパビリティ、チュートリアル完了の識別子は変更しません。

## コミット

- [b63cde3](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b63cde3de36183dd8426cad60e10112c9084571e)
- [93579f2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/93579f26a30ba1f4a2c778c37861e0ddaf0a3b80)
- [b97812e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b97812eb7fc854cfaa042c4342bbb713b3609162)
- [d9e3d34](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d9e3d346f2a3c878067dbb9d79e4624c28daf63d)
- [14a33e6](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/14a33e61511202c5c9c2e855f034e554ffd26d7e)
- [12e63fe54](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/12e63fe545ad3a0d93848bfc8b627723fff6f1de)
- [8e73fc9d4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8e73fc9d42b9731cc7fe0ea5265840a95e086134)
