# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export |
| 作業クローン推奨 | `c:\Dev\Scripts\AI\gemini-live-export` |
| 現在ブランチ | `feature/images-attachments`（Step8） |
| 前ブランチ | `feature/download`（Step7 完了・`c20915b`） |
| **推奨モデル（Step8）** | **Composer 2.5**（extract-messages 中心） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout feature/images-attachments
```

## 今の状態

- Step0〜7 完了
- Step8 **実装済み（実機確認待ち）**: User `img.preview-image` → `[Image]`
- Assistant 生成画像・非画像ファイルは **未確認のため未実装**
- `[class*="upload"]` / `xap-uploader-dropzone` はチャット全体 UI → **使わない**
- content scripts は **同一グローバル** — モジュール間で `const` 名を重複させない
- 拡張更新後は **Gemini タブのリロード必須**
- `tasks/deferred/` は開いてよい

## Step8 実装メモ

- `extract-messages.js`: `img.preview-image` 件数分 `[Image]` を本文末尾に付与（テキスト無しでもプレースホルダーのみで残る）
- DESIGN プレースホルダー: 画像=`[Image]` / 添付=`[Attachment]`（後者はセレクタ未確定で未実装）

## 次にやること

1. **実機確認**: 拡張リロード → 画像付き会話タブ再読込 → Save → `.md` に `[Image]` があること
2. 動作確認後コミット（依頼時）
3. Assistant 画像 / PDF 等の追加調査があれば docs 追記 → セレクタ確定後に拡張
4. Step9（仮想スクロール・KaTeX）は実機で必要と判明してから

## 確定セレクタ（実装に使ってよい）

| 用途 | セレクタ |
|------|----------|
| コンテナ | `.conversation-container`（leave-animation 除外） |
| User | `user-query` → `.query-text` |
| Assistant | `model-response` → `message-content` |
| Chat ID | `/u/{n}/app/{id}` および `/app/{id}` |
| タイトル | 未確定 DOM → `document.title` / chat ID フォールバック |
| User 画像 | `user-query img.preview-image` → `[Image]` |
| 禁止 | `[class*="thinking"]` 本文除外 / `[class*="upload"]` を添付扱い |

## 新チャットへの貼り付け例（Step8 実機確認後）

```text
CONTINUE.md を読んで、Step8 の実機確認結果を前提に
次 Step（またはコミット）を進めてください。
```
