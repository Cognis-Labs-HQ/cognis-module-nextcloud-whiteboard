# 安定したホワイトボード有効化ライフサイクル

**機能ブランチ:** feature-fix-module-enable-lifecycle-fail

## 有効化前の設定処理を分離

Nextcloud Whiteboard は、無効状態で設定ルートと有効化テストルートだけを登録する専用 API エントリーポイントを宣言するようになりました。実行時ルート、ストレージ名前空間、共有フロー、公開ホワイトボード機能は、有効化されるまで登録されません。

## 設定登録を安全に共用

有効時と無効時の API エントリーポイントは同じ設定登録層を使用し、検証、疎通確認、認証、依存関係が利用できない場合の応答をライフサイクル全体で一貫させます。

## 無効時のライフサイクル契約を検証

自動テストでマニフェストのエントリーポイントを確認し、無効時の登録が実行時のファイル機能や共有機能を要求せず、有効化前のルートだけを公開することを保証します。

## 厳格化されたモジュール境界検証に対応

Whiteboard のブラウザーコードは、Cognis の内部パスをインポートせず、公開グローバル機能レジストリからホストの UI コンテキストを取得するようになりました。ボード消去コントロールもモジュール所有のスタイルクラスを使用し、有効化を妨げていた 2 件の検証違反を解消しました。

## 起動前の疎通確認を維持

実行時の事前確認ルートが共有の疎通確認タイムアウトを明示的にインポートするようになり、設定登録の分離後に発生していた参照エラーを防ぎます。回帰テストでは、このルートが共有タイムアウトを使用することを確認します。

## コミット

- [8d61422](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8d61422c80b020af8d4734b7bc52e213b83da5d0)

- [c419a3d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c419a3d499a9ab4668e23225f42587862d6beb45)

- [2c6ec86](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/2c6ec86d1e83b4a5157972e4877ed343390ab221)

- [b725331](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b725331e48adff3f25bdd40447b22f41a2d2045b)

- [7e22cba](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7e22cbaf70bd8f0184b000e757ac1c268059645f)
