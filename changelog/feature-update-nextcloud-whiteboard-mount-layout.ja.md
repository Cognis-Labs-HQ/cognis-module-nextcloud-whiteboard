# Whiteboard の作業領域を全面表示

**機能ブランチ:** feature-update-nextcloud-whiteboard-mount-layout

## 新しいマウントレイアウトに対応

Nextcloud Whiteboard は、枠なしで高さを固定する page composer レイアウトを使用するようになり、コンテンツを入れ子でスクロールせずにキャンバスが利用可能なウィジェット全体を満たします。

## キャンバスのオーバーフローを抑制

キャンバスステージが独自の自動スクロール領域を作成しなくなり、描画操作が表示中のウィジェットとずれないようになりました。

## コンポーネントウィンドウを改善

コンポーネントとしてマウントされた Whiteboard では、共同ポインター追跡を維持しながら共有ボタンを表示しないようにしました。キャンバスグリッドを親要素の高さに制限し、ツールバーの下に残る領域だけをキャンバスへ割り当てることで縦方向のオーバーフローを防ぎ、共有操作は Whiteboard のフルページに限定します。

## ホスト所有の再利用可能リソースを使用

Whiteboard のブラウザーコードは、共有ユーティリティとスタイルを `ui:reuse` 機能から取得するようになりました。不要になったモジュール CSS と冗長な保存済み要素ラッパーを削除し、再利用可能な UI 動作を Cognis が一元的に所有するようにしました。

## コミット

- [1c5cd96](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1c5cd967cfd773f0453ae41429dd37abacb5d046)
- [6bda211](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6bda2116eb158add7b7d56caee3d8926dd58d7da)
- [cc3318c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/cc3318cda3855bec02fa96bd11056e19b5483f9a)
- [264d2b2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/264d2b2342fbf2c25b1b0e65146e9dbddd0f10c2)
- [f1bf36e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f1bf36e764fa022f7f59e405d697d4fcc0afc049)
- [23dd970](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/23dd970372c2f0d16e379e68cacb733f274ecf4a)
