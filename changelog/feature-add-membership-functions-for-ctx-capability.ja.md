# キャンバスメンバーシップのオーケストレーションを追加

**機能ブランチ:** feature-add-membership-functions-for-ctx-capability

## 直接的なメンバーシップ変更を提供

Jitsi Meet などのオーケストレーターは、正規の実行者アカウント ID とユーザーアカウント ID を指定し、CTX capability `whiteboard:membership` を介してキャンバス参加者を追加または削除できるようになりました。この変更を実行できるのはキャンバス所有者だけで、所有者自身のアクセスは削除できません。

## コミット

- [ba1ec07](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ba1ec07cde8d4cdaceebdfc6295a3ed08c9eb33b)
