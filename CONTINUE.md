# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export |
| 作業クローン推奨 | `c:\Dev\Scripts\AI\gemini-live-export` |
| 現在ブランチ | `feature/detect-chat`（Step2 + Track C 実機結果） |
| 次ブランチ | `feature/extract-conversation`（Step3・`feature/detect-chat` から分岐） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout feature/detect-chat
git pull
git checkout -b feature/extract-conversation
```

## 今の状態

- Step0〜2 完了（detect.js コミット済み）
- **Track C 実機確認完了・Step3〜5 コア ゲート通過**（2026-08-11）
- docs: `docs/dom-research.md` に実機結果・確定セレクタあり
- Step8 添付詳細 / Step9 仮想スクロール実験は未（ブロッカーではない）

## 次にやること

1. **Step3** Conversation 取得（DOM）— `DESIGN.md` の Conversation 節 + 実機確定セレクタのみ
2. 続けて Step4 Message / Step5 Role（同じ確定セレクタ）
3. `tasks/deferred/` は Step6 以降（KaTeX 参考は R05 を Step4/5 付近で可）

## 確定セレクタ（実装に使ってよい）

| 用途 | セレクタ |
|------|----------|
| コンテナ | `.conversation-container`（leave-animation 除外） |
| User | `user-query` → `.query-text` |
| Assistant | `model-response` → `message-content` |
| Chat ID | `/u/{n}/app/{id}` および `/app/{id}` |
| タイトル | 未確定 → chat ID / `document.title` フォールバック |
| 禁止 | `[class*="thinking"]` で本文除外（UI 誤検出） |

## 新チャットへの貼り付け例（Step3）

```text
CONTINUE.md と tasks/00-INDEX.md と tasks/constraints.md と
DESIGN.md（Conversation / モジュール表）と docs/dom-research.md の実機結果だけ読んで、
Step3（Conversation 取得）を実装してください。
ブランチは feature/extract-conversation（feature/detect-chat から作成）。
実機確定セレクタのみ使用。未確認セレクタ・Step6 以降の Markdown/Download は禁止。
完了後は tasks/_completion-report.md 形式で報告してください。
```
