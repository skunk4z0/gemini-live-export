# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export |
| 作業クローン推奨 | `c:\Dev\Scripts\AI\gemini-live-export` |
| 現在ブランチ | `feature/filter-messages`（Step5 完了・動作確認済み・コミット済み） |
| 次ブランチ | `feature/markdown`（Step6・`feature/filter-messages` から分岐） |
| **推奨モデル（Step6）** | **Grok 4.5**（`markdown.js` + content/popup 配線） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout feature/filter-messages
git pull
git checkout -b feature/markdown
```

## 今の状態

- Step0〜5 完了（`filter-messages.js` コミット済み: `781f217`）
- Step5 手動確認済み: Popup `Ready: Chrome拡張のコード解析と課金対策 - Google Gemini (14 messages)`（2026-08-11）
- content scripts は **同一グローバル** — モジュール間で `const` 名を重複させない
- 拡張更新後は **Gemini タブのリロード必須**（古い content script が残る）
- Console で API を叩くときは **content script コンテキスト**を選ぶ
- **Track C 実機確認完了・Step3〜5 コア ゲート通過**
- docs: `docs/dom-research.md` に実機結果・確定セレクタあり
- `tasks/deferred/` は Step6 から開いてよい

## 次にやること

1. **Step6** Markdown 生成 — `markdown.js`（文字列生成のみ。DOM / Download 禁止）
2. Step7 Download（`tasks/deferred/R03-R04`）
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

## 新チャットへの貼り付け例（Step6）

```text
CONTINUE.md と tasks/00-INDEX.md と tasks/constraints.md と
DESIGN.md（出力仕様 / markdown モジュール）と tasks/deferred/R01・R02 を読んで、
Step6（Markdown 生成）を実装してください。
ブランチは feature/filter-messages から feature/markdown を作成。
DOM 取得・Role 判定は既存モジュールに任せ、markdown.js は文字列生成のみ。
Download は Step7 まで禁止。完了後は tasks/_completion-report.md 形式で報告してください。
```
