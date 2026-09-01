# キャンバスメンバーシップのオーケストレーションを追加

**機能ブランチ:** feature-add-membership-functions-for-ctx-capability

## 直接的なメンバーシップ変更を提供

Jitsi Meet などのオーケストレーターは、正規の実行者アカウント ID とユーザーアカウント ID を指定し、CTX capability `whiteboard:membership` を介してキャンバス参加者を追加または削除できるようになりました。この変更を実行できるのはキャンバス所有者だけで、所有者自身のアクセスは削除できません。

## メンバーシップ変更を堅牢化

メンバーシップ変更では、アクセス前にストレージを初期化し、非表示プロフィールを拒否し、現在の登録状態と有効化状態を尊重するため呼び出し時にホストの正規プロフィール ID capability を解決するようになりました。また、内部情報を公開せずに依存関係の障害を報告します。

## 正規のハンドル正規化を再利用

Whiteboard ウィンドウの作成では、モジュール独自のハンドル正規化処理をインポートせず、ホストのプロフィール ID capability を介して所有者を正規化するようになりました。

## コミット

- [a5d8e7c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a5d8e7cc98565a24365e0e7f4faf42861c722c56)
- [972b573](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/972b573d595667a3cd6786327b13f3cf08a897d6)
- [ba1ec07](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ba1ec07cde8d4cdaceebdfc6295a3ed08c9eb33b)
- [a2ccce2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a2ccce25543b6b580960bfc71c6d2acf9daec9f0)
