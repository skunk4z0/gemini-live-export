# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export |
| 作業クローン推奨 | `c:\Dev\Scripts\AI\gemini-live-export` |
| 現在ブランチ | `feature/extract-conversation`（Step3 完了・動作確認済み） |
| 次ブランチ | `feature/extract-messages`（Step4・`feature/extract-conversation` から分岐） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout feature/extract-conversation
git pull
git checkout -b feature/extract-messages
```

## 今の状態

- Step0〜3 完了（`extract-conversation.js` コミット済み）
- Step3 手動確認済み: Popup でタイトル取得成功（2026-08-11）
- Console で `GeminiExtractConversation` を叩くときは **content script コンテキスト**を選ぶ（`top` では ReferenceError）
- **Track C 実機確認完了・Step3〜5 コア ゲート通過**
- docs: `docs/dom-research.md` に実機結果・確定セレクタあり
- Step8 添付詳細 / Step9 仮想スクロール実験は未（ブロッカーではない）

## 次にやること

1. **Step4** Message 取得（DOM）— `extract-messages.js`、実機確定セレクタのみ
2. **Step5** Role 判定・空除外 — `filter-messages.js`
3. `tasks/deferred/` は Step6 以降（KaTeX 参考は R05 を Step4/5 付近で可）

## 確定セレクタ（実装に使ってよい）

| 用途 | セレクタ |
|------|----------|
| コンテナ | `.conversation-container`（leave-animation 除外） |
| User | `user-query` → `.query-text` |
| Assistant | `model-response` → `message-content` |
| Chat ID | `/u/{n}/app/{id}` および `/app/{id}` |
| タイトル | 未確定 DOM → `document.title` / chat ID フォールバック（Step3 実装済み） |
| 禁止 | `[class*="thinking"]` で本文除外（UI 誤検出） |

## 新チャットへの貼り付け例（Step4）

```text
CONTINUE.md と tasks/00-INDEX.md と tasks/constraints.md と
DESIGN.md（Conversation / Message / モジュール表）と docs/dom-research.md の実機結果だけ読んで、
Step4（Message 取得）を実装してください。
ブランチは feature/extract-messages（feature/extract-conversation から作成）。
実機確定セレクタのみ使用。Role フィルタ本実装は Step5、Markdown/Download は禁止。
完了後は tasks/_completion-report.md 形式で報告してください。
```
