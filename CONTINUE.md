# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export |
| 作業クローン推奨 | `c:\Dev\Scripts\AI\gemini-live-export` |
| 現在ブランチ | `feature/download`（Step7・`feature/markdown` から分岐） |
| 前ブランチ | `feature/markdown`（Step6 完了・コミット済み） |
| **推奨モデル（Step7）** | **Grok 4.5**（utils / download / background / popup 配線） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout feature/download
```

## 今の状態

- Step0〜6 完了（Step6: `a0877ab Add Markdown generation (Step6)`）
- Step7 実装済み（未コミット・**実機の Save ダイアログ確認待ち**）
- content scripts は **同一グローバル** — モジュール間で `const` 名を重複させない
- 拡張更新後は **Gemini タブのリロード必須**（古い content script が残る）
- Console で API を叩くときは **content script コンテキスト**を選ぶ
- **Track C 実機確認完了・Step3〜5 コア ゲート通過**
- docs: `docs/dom-research.md` に実機結果・確定セレクタあり
- `tasks/deferred/` は Step6 から開いてよい

## Step7 実装メモ

- `utils.js`: `GeminiUtils.buildFilename`（禁止文字は `-` 置換）
- `download.js`: `GeminiDownload.downloadTextFile`（MV3 SW は data: URL。`saveAs: true`）
- `background.js`: `Messages.DOWNLOAD_FILE` 処理
- Popup Save → GET_MARKDOWN → DOWNLOAD_FILE（タイトルは conversation から）

## 次にやること

1. **実機確認**: 拡張リロード → Gemini タブ再読込 → Save → 保存ダイアログ → `.md` 内容確認
2. 動作確認後コミット（依頼時）
3. Step8 画像・添付（将来） / Step9 仮想スクロール・KaTeX（実機次第）
4. `[class*="thinking"]` は本文除外に使わない（UI 誤検出）

## 確定セレクタ（実装に使ってよい）

| 用途 | セレクタ |
|------|----------|
| コンテナ | `.conversation-container`（leave-animation 除外） |
| User | `user-query` → `.query-text` |
| Assistant | `model-response` → `message-content` |
| Chat ID | `/u/{n}/app/{id}` および `/app/{id}` |
| タイトル | 未確定 DOM → `document.title` / chat ID フォールバック（Step3 実装済み） |
| 禁止 | `[class*="thinking"]` で本文除外（UI 誤検出） |

## 新チャットへの貼り付け例（Step7 実機確認後）

```text
CONTINUE.md を読んで、Step7 の実機確認結果を前提に
次 Step（またはコミット）を進めてください。
```
