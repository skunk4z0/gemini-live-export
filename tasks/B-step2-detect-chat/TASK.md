# Track B — Step2 ページ判定

| 項目 | 値 |
|------|-----|
| **推奨モデル** | **Composer 2.5**（単一ファイル主体） |
| **ブランチ** | `feature/detect-chat`（`feature/extension-skeleton` から分岐） |
| **依存** | Track A 完了 |
| **次** | Track C（並行可）→ 人間の実機確認 |

## 読むファイル（これだけ）

1. `gemini-live-export/tasks/constraints.md`
2. **このファイル**
3. Track A で作った `gemini-live-export/src/content.js` / `popup/popup.js`（配線に必要な箇所のみ）
4. （任意）`gemini-live-export/DESIGN.md` の「対象ページ」節だけ

## 読まない

- `tasks/deferred/**`
- ルート ChatGPT の `src/detect.js`
- DOM Message 取得設計・参考実装全文

---

## 実装対象

**主ファイル**: `gemini-live-export/src/detect.js`（新規）

必要なら最小限の呼び出し追加のみ:

- `content.js` から export 関数を使う
- `popup.js` で Save 有効/無効に反映
- `manifest.json` の content_scripts に `detect.js` を追加（未追加なら）

**DOM 本文への依存は禁止。**

## 要件

1. 現在 URL が Gemini チャットページか判定する関数  
   - 想定: `https://gemini.google.com/app/*` → true  
   - トップ・履歴一覧・非 Gemini → false
2. URL から chat ID（`/app/{id}`）を抽出する関数を同モジュールに含めてよい
3. `/u/n/app/{id}` の可能性あり（dom-research 候補）  
   - **両方対応する正規表現**にするか、  
   - 未対応なら **コメントで TODO 明記**  
   - 実機確認まで仕様は **暫定**
4. ホストは `gemini.google.com`（https のみ）

## 推奨 API 形（例・強制ではない）

```javascript
/** @param {string | undefined | null} url @returns {boolean} */
function isGeminiChatUrl(url) { /* ... */ }

/** @param {string | undefined | null} url @returns {string | null} */
function extractGeminiChatId(url) { /* 暫定 */ }

const GeminiDetect = Object.freeze({
  isGeminiChatUrl,
  extractGeminiChatId,
});
```

## 完了条件

- [ ] `/app/{id}` 形式のチャット URL → true
- [ ] Gemini トップ・一覧等 → false
- [ ] 非 Gemini → false
- [ ] DOM クエリなし
- [ ] ID 抽出は暫定である旨がコード or コメントで分かる

## 動作確認（最低限）

手動で以下をコンソール or 単体呼び出しで確認:

| URL 例 | 期待 |
|--------|------|
| `https://gemini.google.com/app/abc123` | true, id=`abc123` |
| `https://gemini.google.com/u/0/app/abc123` | true（対応時）or TODO |
| `https://gemini.google.com/app` | false（方針をコメントで明記） |
| `https://gemini.google.com/` | false |
| `https://chatgpt.com/c/xxx` | false |

## コミットメッセージ（英語）

```text
Detect Gemini chat page
```

## Out of scope

Conversation タイトル取得、Message 取得、Role 判定、スクロール。
