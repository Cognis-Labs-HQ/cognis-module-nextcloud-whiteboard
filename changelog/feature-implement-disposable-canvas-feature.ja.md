# 使い捨てキャンバスと確実な保存

**機能ブランチ:** feature-implement-disposable-canvas-feature

## 会議用の使い捨てキャンバス

連携元は一時的なキャンバスを開くことができ、各ユーザーが保存を押した場合に限り、そのユーザー用に保存されます。

## 複数ユーザーの保存済みコピー

通常のキャンバスでは各メンバーの保存済みコピーが作成・更新され、取り消された共有のコピーは削除されます。

## 見やすいホーム画面と保存状態

キャンバスが増えるとカードが広がり、5件以上ではスクロールできます。保存時にはアニメーション付きのチェックと保存済みラベルが表示されます。

## 会議連携ゲートウェイ

グローバルなブラウザー UI ゲートウェイにより、会議連携は別モジュールの HTTP ルートに依存せず、同期された使い捨てキャンバスを作成または解決できます。

## 互換性のある UI 機能登録

Whiteboard ゲートウェイは標準のブラウザー機能提供 API を使用し、遅延ログイン時の実行エラーや一般的なエラーポップアップを発生させません。

## Whiteboard ゲートウェイプロバイダーの検出

Whiteboard のナビゲーションバーエントリがブラウザー機能を宣言するようになり、Jitsi がオプションの Whiteboard ボタンを関連付ける前に、Host のプロバイダーローダーがゲートウェイを読み込みます。

## 埋め込みの使い捨てキャンバスを開く

コンポーネントウィンドウが渡されたフォーカス状態を使用し、Whiteboard のホーム画面ではなく、指定された使い捨てキャンバスを直ちに開くようになりました。

## 要素を対象とするコンポーネントウィンドウ

要素を対象とするコンポーネントのマウントはフレームレス表示を維持し、フォーカスされた使い捨てキャンバスが開いてからコンポーネントページの準備完了を通知します。

## 保護されたコンポーネントのライフサイクル

Whiteboard コンポーネントのマウントが Host のナビゲーション方針に従い、保護されたコンポーネントウィンドウのライフサイクル向けに冪等な destroy ハンドルを返すようになりました。

## 準備済み会議キャンバスの引き渡し

ブラウザーゲートウェイが準備した使い捨てキャンバスを保持し、Host がラップされた、または不完全なフォーカスコンテキストを渡した場合でも、コンポーネントのマウントが正しいキャンバスを復元できるようになりました。

## ルート切り替えに安全なコンポーネントクリーンアップ

コンポーネントのクリーンアップが中断リスナーを解除し、古いマウントハンドルを無視して、Cognis が discardAll による SPA ルート切り替えを完了する前に Whiteboard のマウント状態を消去するようになりました。

## ルートを限定した直接エントリ

Whiteboard のブラウザーエントリは /whiteboard と /whiteboards でのみ自動的に直接マウントし、別ページでのコンポーネント読み込みが無関係な Host ルートへマウントされないようになりました。

## コンパクトなキャンバスツールバー

狭いコンポーネントウィンドウでは描画ツールをスクロールしながら保存状態を固定表示し、使い捨てキャンバスに未保存の変更がある間は強調された保存ボタンを常に表示します。

## 折り返しツールバーと非公開の使い捨てキャンバス

コンパクトなツールバーでは横スクロールせず、利用可能な行へ操作を折り返します。使い捨てキャンバスは保存ボタンを直ちに表示し、未保存の変更がある間は常に見える状態を保ち、共有操作を非表示にします。

## 保存したすべてのメンバーで同期される一つのキャンバス

手動保存と自動保存では、共同編集キャンバス全体を基準となるスナップショットとして保存するようになりました。共有キャンバスを再度開く全員が同じ最新内容を受け取り、使い捨てキャンバスでは保存を選択したメンバーのコピーだけが更新されます。

## 競合に強い共同編集と元に戻す操作

同時保存を直列化し、ある参加者の変更が別の参加者の変更を上書きしないようにしました。元に戻す操作とやり直しではより新しい要素リビジョンを配信し、使い捨てセッションの操作表示はセッション情報の取得直後に更新されます。

## 保守しやすいアプリケーションモジュール

Whiteboard のナビゲーションと接続事前確認を役割別のモジュールへ分離しました。メインのアプリケーションエントリでは、すべてのトップレベル関数の間に明確な空行を保ち、書式を圧縮せず読みやすさを維持しています。

## コミット

- [456de64](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/456de64983b6986869dfa66094e4b7bcdd48cfcc)
- [1a7f5f6](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1a7f5f6f12268886a79afb3c51ed4f2b966b282d)
- [f033368](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f03336872aee142eac55cdea8c92d71a42de3755)
- [8778738](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8778738e12e864855d02f8f99076fca7504b1b22)
- [2cfb57e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/2cfb57e1ef85ef9dcdce0caeeecb7405b7a01a12)
- [7458d9e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7458d9ec32920a361d12e38c0c08b3cf571d6857)
- [71c41ad](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/71c41ad6a516a09c3c5c3e0454391ed63335c29b)
- [946d0dc](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/946d0dc64258f227c718b6627f54bdb4346aa1a6)
- [f822dbe](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f822dbe74798c2a8811cf59ffb8b410c1887cff8)
- [02841fd](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/02841fda50435799a91e4ebc97d2c192aa168247)
- [3f7a212](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3f7a2127625a9b60edc21eac8e0924544da1b6d6)
- [407852f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/407852fcfefdb72fc5c0d28d41a8889bd039b450)
- [4a69ab1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4a69ab19d181394dd8d96815ed0387cb03d756e0)
- [96a577d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96a577d1c4200e82ddf46f3be484bd972c8d57fb)
- [a55768d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a55768d1b367d662b84254069a682fd94d3a88ad)
- [b38fef2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b38fef2316dd81957f95542ceef74e5fcb7d0cee)
