# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export |
| 作業クローン推奨 | `c:\Dev\Scripts\AI\gemini-live-export` |
| 現在ブランチ | `feature/filter-messages`（Step5 実装済み・**実機確認待ち**） |
| 次ブランチ | Step6 着手時に `feature/markdown` 等（`feature/filter-messages` から分岐想定） |
| **推奨モデル（Step6）** | **Grok 4.5**（`markdown.js` + content/popup 配線） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout feature/filter-messages
git pull
# 実機確認後に commit。Step6 は deferred を読んでから新ブランチ
```

## 今の状態

- Step0〜4 完了（`extract-messages.js` コミット済み）
- Step5 実装済み: `filter-messages.js`（Role 許可 + 空除外、DOM なし）→ `content.js` の `GET_MESSAGES` で `extract` → `filter`
- **Step5 実機確認待ち**（拡張更新後は Gemini タブのリロード必須）
- content scripts は **同一グローバル** — モジュール間で `const` 名を重複させない
- Console で API を叩くときは **content script コンテキスト**を選ぶ
- **Track C 実機確認完了・Step3〜5 コア ゲート通過**
- docs: `docs/dom-research.md` に実機結果・確定セレクタあり

## 次にやること

1. **Step5 実機確認**: Popup `Ready: … (N messages)`（空除外後の件数）。必要なら content script で `GeminiFilterMessages.filterMessages(...)` を確認
2. Step6〜 Markdown / Download（`tasks/deferred/` を初めて開いてよい）
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
