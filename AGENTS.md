# AGENTS.md（gemini-live-export）

AI エージェント向け開発ルール。作業時は **DESIGN.md と本ファイル**を正とする。

親リポジトリのルート `AGENTS.md`（ChatGPT 用）と混同しないこと。

---

## 基本方針

| 方針 | 内容 |
|------|------|
| 設計書を優先 | 矛盾時は本ディレクトリの DESIGN.md |
| 実機を優先 | DOM セレクタは `docs/dom-research.md` の実機結果後に実装 |
| 推測実装しない | 未確認セレクタをコードに書かない |
| 1 モジュール 1 責務 | 表は DESIGN.md |
| YAGNI | ChatGPT 拡張との共通化・抽象化はしない |
| 外部送信禁止 | 第三者 API・クラウド同期なし |

---

## トークン節約

実装セッションでは `tasks/00-INDEX.md` → 担当 `TASK.md` → 列挙ファイルのみ読む。  
`tasks/deferred/` は Step6 以降まで開かない。

モデル目安:

- **Grok 4.5**: 複数ファイル横断（Step1 雛形、download 配線など）
- **Composer 2.5**: 単一ファイル主体（detect.js、docs 追記など）

コピペプロンプト: `tasks/PROMPTS.md`

---

## スコープ

### 今やる

- Step1 拡張雛形、Step2 ページ判定
- Track C: 実機確認用 docs 整備（人間が結果転記）

### 禁止（ゲート）

- `docs/dom-research.md` に実機結果が入るまで **Step3〜5 の実装コードを書かない**
- 商用 UI（Quota / Pro / 多言語 / 広告）
- ChatGPT コードへの Gemini 混入、共通 Provider 抽象

---

## Git

- `main` へ直接コミットしない
- 原則 1 Step = 1 feature ブランチ（例: `feature/extension-skeleton`）
- コミットメッセージは英語・簡潔
- ユーザー依頼があるまで commit / push しない（依頼時のみ実施）

ブランチ例:

```text
feature/gemini-bootstrap         # Step0
feature/extension-skeleton       # Step1
feature/detect-chat              # Step2
feature/extract-conversation     # Step3
feature/extract-messages         # Step4（次）
```

---

## 現在の実装状態

| Step | 状態 |
|------|------|
| Step0 設計・調査枠・タスク | 完成 |
| Step1 拡張雛形 | 完成 |
| Step2 ページ判定 | 完成 |
| Step3 Conversation 取得 | 完成（動作確認済み） |
| Step4 Message 取得 | 完成（動作確認済み） |
| Step5 Role / 空除外 | 完成（動作確認済み） |
| Step6〜9 | 未着手 |

---

## Step 完了時の報告

`tasks/_completion-report.md` に従う。
