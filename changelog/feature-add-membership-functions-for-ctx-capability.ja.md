# キャンバスメンバーシップのオーケストレーションを追加

**機能ブランチ:** feature-add-membership-functions-for-ctx-capability

## 直接的なメンバーシップ変更を提供

Jitsi Meet などのオーケストレーターは、正規の実行者アカウント ID とユーザーアカウント ID を指定し、CTX capability `whiteboard:membership` を介してキャンバス参加者を追加または削除できるようになりました。この変更を実行できるのはキャンバス所有者だけで、所有者自身のアクセスは削除できません。

## メンバーシップ変更を堅牢化

メンバーシップ変更では、アクセス前にストレージを初期化し、非表示プロフィールを拒否し、現在の登録状態と有効化状態を尊重するため呼び出し時にホストの正規プロフィール ID capability を解決するようになりました。また、内部情報を公開せずに依存関係の障害を報告します。

## 正規のハンドル正規化を再利用

すべての API、アクセス制御、永続化処理で、ハンドルの正規化にホストのプロフィール ID capability を使用するようになりました。重複していたモジュール独自の正規化処理は完全に削除しました。

## コミット

- [a5d8e7c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a5d8e7cc98565a24365e0e7f4faf42861c722c56)
- [972b573](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/972b573d595667a3cd6786327b13f3cf08a897d6)
- [ba1ec07](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ba1ec07cde8d4cdaceebdfc6295a3ed08c9eb33b)
- [a2ccce2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a2ccce25543b6b580960bfc71c6d2acf9daec9f0)
- [824bed8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/824bed8296198c32c69bc928130f7b93c1a56a6f)
