# 共通制約（全タスク）

トークン節約のため短く保つ。矛盾時は `gemini-live-export/DESIGN.md` を正とする。  
実装・変更は **`gemini-live-export/` 配下のみ**。ルートの ChatGPT 拡張には手を入れない。

## ゲート

- **実機確認結果が `docs/dom-research.md` に反映されるまで、Step3〜5 の実装コードを書かない**
- セレクタの推測実装禁止（「たぶん動く」禁止）

## 今回スコープ外

- Step3 Conversation / Step4 Message / Step5 Role
- Step6 Markdown / Step7 Download / Step8 画像 / Step9 仮想スクロール
- 商用 UI（Quota・Pro・多言語・広告・クラウド同期）
- ChatGPT と Gemini の共通化・抽象化・Provider インターフェース
- `oauth2` / Drive・Dropbox・Notion 等の host_permissions
- CSP の `connect-src` 緩和、外部 AI API

## Git

- `main` へ直接コミットしない
- Step ごと feature ブランチ
- 動作確認後にコミット（英語メッセージ）
- **ユーザーが依頼するまで commit / push しない**（プロジェクト運用に従う）

## 参考実装パターン

`tasks/deferred/` に隔離済み。**Step6・7・9 着手時のみ**読む。今回の A/B/C では開かない。
