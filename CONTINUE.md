# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export |
| 作業クローン推奨 | `c:\Dev\Scripts\AI\gemini-live-export` |
| 現在ブランチ | `feature/extract-messages`（Step4 完了・動作確認済み） |
| 次ブランチ | `feature/filter-messages`（Step5・`feature/extract-messages` から分岐） |
| **推奨モデル（Step5）** | **Composer 2.5**（`filter-messages.js` 単一ファイル主体） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout feature/extract-messages
git pull
git checkout -b feature/filter-messages
```

## 今の状態

- Step0〜4 完了（`extract-messages.js` コミット済み）
- Step4 手動確認済み: Popup `Ready: … (14 messages)`（2026-08-11）
- content scripts は **同一グローバル** — モジュール間で `const` 名を重複させない（Step4 で `CONVERSATION_CONTAINER_SELECTOR` 衝突を修正済み → `MESSAGE_*`）
- 拡張更新後は **Gemini タブのリロード必須**（古い content script が残る）
- Console で API を叩くときは **content script コンテキスト**を選ぶ
- **Track C 実機確認完了・Step3〜5 コア ゲート通過**
- docs: `docs/dom-research.md` に実機結果・確定セレクタあり

## 次にやること

1. **Step5** Role 判定・空除外 — `filter-messages.js`（DOM 取得はしない）
2. Step6〜 は Markdown / Download（`tasks/deferred/`）
3. `[class*="thinking"]` は本文除外に使わない（UI 誤検出）

## 確定セレクタ（実装に使ってよい）

| 用途 | セレクタ |
|------|----------|
| コンテナ | `.conversation-container`（leave-animation 除外） |
| User | `user-query` → `.query-text` |
| Assistant | `model-response` → `message-content` |
| Chat ID | `/u/{n}/app/{id}` および `/app/{id}` |
| タイトル | 未確定 DOM → `document.title` / chat ID フォールバック（Step3 実装済み） |
| 禁止 | `[class*="thinking"]` で本文除外（UI 誤検出） |

## 新チャットへの貼り付け例（Step5）

```text
CONTINUE.md と tasks/00-INDEX.md と tasks/constraints.md と
DESIGN.md（Message / filter-messages / モジュール表）と docs/dom-research.md の実機結果だけ読んで、
Step5（Role 判定・空除外）を実装してください。
ブランチは feature/filter-messages（feature/extract-messages から作成）。
DOM 取得は extract-messages に任せ、filter-messages.js で Role・空メッセージ除外のみ。
Markdown/Download は禁止。完了後は tasks/_completion-report.md 形式で報告してください。
```
