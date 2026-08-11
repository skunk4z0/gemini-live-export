# Track A — Step1 拡張雛形

| 項目 | 値 |
|------|-----|
| **推奨モデル** | **Grok 4.5**（複数ファイル横断） |
| **ブランチ** | `feature/extension-skeleton` |
| **依存** | Step0 完了（DESIGN / AGENTS / README / docs/dom-research 想定） |
| **次** | Track B |

## 読むファイル（これだけ）

1. `gemini-live-export/tasks/constraints.md`
2. **このファイル**
3. （任意・構造参考のみ）リポジトリルートの `manifest.json` の**キー名だけ**。URL / 権限はコピーしない

## 読まない

- `tasks/deferred/**`
- `tasks/B-*` / `tasks/C-*`
- ルートの `src/**`（ChatGPT 実装）
- Step3 以降の長文・参考実装全文

---

## 目的

DOM セレクタに依存しない Chrome 拡張の骨格だけを **`gemini-live-export/` 配下**に作る。Save は後続まで無効でよい。

## 作成する構成

```text
gemini-live-export/
├── manifest.json
├── src/
│   ├── content.js          # エントリー（空/雛形）
│   ├── background.js       # Service Worker（空/雛形）
│   ├── messages.js         # メッセージ定数のみ
│   └── popup/
│       ├── popup.html
│       ├── popup.js        # 状態表示・Save 無効雛形
│       └── popup.css
└── icons/                  # 仮アイコン可
```

## manifest.json 要件

- `manifest_version: 3`
- `content_scripts.matches`: **`https://gemini.google.com/*` のみ**
- `permissions`: **`downloads` のみ**（現時点の最小。余計な権限を足さない）
- `host_permissions`: 空、または `https://gemini.google.com/*` のみ
- **含めない**: Drive/Dropbox/Notion/Yandex 等、`oauth2`、広い CSP/`connect-src`

## popup 要件

- Save ボタンは置く
- この Step では「Gemini ページ判定できるか」だけで有効/無効切替（本文取得は不要）
- Quota / Pro / クロスプロモ / 多言語 UI は作らない

## content / background / messages

- `content.js`: メッセージ受信の空ハンドラ程度（DOM 取得ロジック禁止）
- `background.js`: 起動ログ or 空の `onMessage` 雛形（ダウンロード実装は Step7）
- `messages.js`: ping / ページ判定用などの定数のみ（型・定数）

## 完了条件

- [ ] Chrome「パッケージ化されていない拡張機能」でエラーなく読み込める
- [ ] `gemini.google.com` で Popup が開く
- [ ] Save は無効でも可（後続 Step）
- [ ] 上記最小構成になっている

## コミットメッセージ（英語）

```text
Add extension skeleton
```

## 不明点の扱い

URL 以外の DOM・権限・API は推測で足さない。必要なら「不明点」として報告。

## Out of scope

`detect.js` の本実装（→ Track B）、Conversation/Message 取得、Markdown、ダウンロード本体。
