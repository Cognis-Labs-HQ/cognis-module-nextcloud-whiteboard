# 再接続後のホワイトボード復元を安定化

**機能ブランチ:** feature-fix-whiteboard-canvas-refresh-issue

## 更新後に共有キャンバスをすぐに復元

埋め込み型の複数参加者ホワイトボードに再参加した利用者は、接続中の参加者に最新のシーンを要求するようになりました。他の参加者が編集または選択するのを待たずに、既存のオブジェクトが表示されます。接続中のすべての参加者が同期要求に応答でき、新しい編集を受信した際に統合済みのシーンを送信し直すため、最初の応答が届かない場合でもキャンバスが復元されます。

## コミット

- [c706dc0](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c706dc04e59c0a0f9b316b41f5d672bafc404966)
- [89fce71](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/89fce716329e2cbf7a26ac7a09a04fd0551a086b)
