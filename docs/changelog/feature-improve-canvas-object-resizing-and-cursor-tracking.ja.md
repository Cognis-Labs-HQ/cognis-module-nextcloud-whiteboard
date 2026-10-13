# より滑らかなホワイトボードのリアルタイム共同作業

**機能ブランチ:** feature-improve-canvas-object-resizing-and-cursor-tracking

## 軸を越えてサイズ変更したオブジェクトを反転

サイズ変更ハンドルを反対側の辺までドラッグすると、以前の向きに戻さず、オブジェクトの内容を反転するようになりました。

## リクエストを増やさずカーソルを高速化

制限付きスロットリングと一括プレゼンス更新でネットワーク通信を抑えながら、カーソル更新がほぼリアルタイムで表示されるようになりました。

## 作成途中のオブジェクトも表示

入力中のテキストや描画中の図形を共同作業者が確認できるようになりました。

## 高速編集でも座標の整合性を維持

キャンバスのサイズ変更時に共有オブジェクトの座標を書き換えないようにし、高速な同時変更によって共同作業者ごとに異なるずれが蓄積することを防ぎました。

## 標準キャンバスの境界線を復元

通常のホワイトボードを開くと、境界線なしおよびフレームなしのコンポーネント表示を明示的に無効化し、以前のミーティングから残っているレイアウト状態を置き換えるようになりました。

## コンポーネントウィンドウがページシェルを変更しないように改善

ホワイトボードのコンポーネントウィンドウではページコンポーザーの境界線なしモードを無効のままにし、枠の表示をホストウィンドウに任せるようになりました。これにより、SPA ナビゲーション後の別ページにミーティング表示が引き継がれることを防ぎます。

## コミット

- [c0e93b3](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c0e93b392d2aa3ffcc90fdcff149c1cff6fca293)
- [9b08604](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/9b0860479c280d624734d9415327517ea59926a5)
- [a64b94c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a64b94c3ffd36d56d3f4355d18476b932bd05053)
- [93d0d8a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/93d0d8aa5fcdc7c89eae71208dfada5a6f2d40f4)
- [bdc7b97](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/bdc7b97b510fdd96c816be51df907f7358cb6332)
