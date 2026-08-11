# gemini-live-export 設計書

本ドキュメントは、Gemini 用 Chrome 拡張の正式な設計書です。

**Markdown の骨格は Phase1（chatgpt-export-to-obsidian）を正とし、本ファイルに記載した Frontmatter / 見出し差分のみ Gemini 向けに変更する。**

親リポジトリの ChatGPT 拡張（ルート）とは**別プロダクト**。共通化・抽象化は行わない（YAGNI）。

---

## プロジェクト概要

### 目的

ブラウザで**現在開いている Gemini の 1 チャット**を取得し、Obsidian 用 Markdown を生成する Chrome 拡張（Manifest V3）。

### 設計思想

| 方針 | 内容 |
|------|------|
| 実データ優先 | Gemini DOM は変更がある。実機確認してから DOM 実装する |
| 推測実装禁止 | 存在しない DOM・属性・API を仮定しない |
| 1 モジュール 1 責務 | 取得・変換・生成・保存を分離 |
| AI 不使用 | 外部 AI API・要約・自動タグ付けはしない |
| YAGNI | ChatGPT 拡張との共通ライブラリ化はしない。Gemini 専念 |
| 外部送信禁止 | 同一オリジン外への会話送信禁止。クラウド同期しない |

### データフロー（初期）

```text
Live Chat (gemini.google.com)
        ↓
DOM 抽出（Conversation + Message[]）
        ↓
Markdown (string)  ※ Phase1 互換 + 本 DESIGN の差分
        ↓
Download (YYYY-MM-DD タイトル.md, saveAs: true)
```

ChatGPT 版のような backend-api 主経路は**初期スコープ外**（DOM のみ）。将来必要なら別 Step で検討。

---

## 対象ページ

| URL パターン | 状態 |
|-------------|------|
| `https://gemini.google.com/app/{id}` | Step2 で判定（暫定） |
| `https://gemini.google.com/u/{n}/app/{id}` | 候補。実機確認後に確定 |
| トップ・履歴一覧・非 Gemini | 非対象（Save 無効） |

chat ID 抽出仕様は実機確認まで**暫定**。詳細は `docs/dom-research.md`。

---

## Conversation / Message

```typescript
interface Conversation {
  title?: string;
  id?: string;
  conversation_id?: string;
  create_time?: number;
  update_time?: number;
  url?: string;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  messageId?: string;
  createTime?: number;
}
```

- 出力する role: `user`, `assistant` のみ
- 思考過程・reasoning 相当は実機確認のうえ、原則スキップ
- 空メッセージはスキップ
- Message の並びは**表示順**（timestamp 並べ替え禁止）

---

## 出力仕様

### ファイル名

```text
YYYY-MM-DD タイトル.md
```

- Windows 禁止文字 `< > : " / \ | ? *` は **`-` に置換**（削除しない）
- 保存は毎回 `saveAs: true`（ユーザーが保存先を選択）
- UTF-8（BOM なし）/ LF

### Frontmatter（Phase1 からの差分）

```yaml
---
title: "..."
type: ログ
subtype: AI生ログ
category: ""
summary: ""
status: 下書き
source: Gemini
conversation_id: "..."
created: "YYYY-MM-DD HH:MM"
updated: "YYYY-MM-DD HH:MM"
tags:
  - gemini
---
```

| フィールド | Phase1 (ChatGPT) | Gemini |
|-----------|------------------|--------|
| source | `ChatGPT` | **`Gemini`** |
| tags | `- chatgpt` | **`- gemini`** |
| 他 | 同一 | 同一（category/summary は空のまま。AI 自動生成禁止） |

### 本文見出し（Phase1 からの差分）

```markdown
# タイトル

## 👤 User

（ユーザー発言）

## 🤖 Gemini

（アシスタント発言）
```

| 項目 | Phase1 | Gemini |
|------|--------|--------|
| User 見出し | `## 👤 User` | 同一 |
| Assistant 見出し | `## 🤖 ChatGPT` | **`## 🤖 Gemini`** |

### プレースホルダー（Phase1 同一）

| 種類 | 出力 |
|------|------|
| 画像 | `[Image]` |
| 音声 | `[Audio]` |
| 添付 | `[Attachment]` |
| 未対応 | `[Unsupported content]` |

---

## フォルダ構成（完成形）

```text
gemini-live-export/
├── DESIGN.md
├── AGENTS.md
├── README.md
├── CONTINUE.md              # 新チャット再開用
├── docs/
│   └── dom-research.md      # DOM 候補 + 実機確認記入欄
├── tasks/                   # トークン節約用タスクパック
├── manifest.json            # Step1
├── src/                     # Step1〜
│   ├── detect.js
│   ├── content.js
│   ├── background.js
│   ├── messages.js
│   └── popup/
└── icons/
```

---

## モジュール責務

| モジュール | 責務 | やってはいけないこと |
|-----------|------|---------------------|
| `detect.js` | URL ページ判定・chat ID 抽出（暫定） | DOM Message 取得 |
| `extract-conversation.js` | Conversation メタ（DOM） | Markdown 生成 |
| `extract-messages.js` | Message 取得（DOM） | Role 判定の混在を避ける |
| `filter-messages.js` | Role・空除外 | DOM 取得 |
| `utils.js` | 日時・タイトル・ファイル名 | ドメインロジック混在 |
| `markdown.js` | Markdown 生成のみ | DOM / ダウンロード |
| `download.js` / background | ダウンロードのみ | Markdown 内容の変更 |
| `content.js` | 制御 | 各モジュール責務を直書きしない |
| `popup.js` | Popup UI | DOM 取得ロジック混在 |

---

## Step 分割

| Step | 内容 | 状態 | ゲート |
|------|------|------|--------|
| Step0 | 設計・DOM 調査枠・タスクパック | 完成 | — |
| Step1 | 拡張雛形 | 完成 | — |
| Step2 | ページ判定 `detect.js` | 完成 | — |
| Step3 | Conversation 取得（DOM） | 完成 | — |
| Step4 | Message 取得（DOM） | 完成 | — |
| Step5 | Role 判定 | 完成 | — |
| Step6 | Markdown 生成 | 完成 | — |
| Step7 | ダウンロード | 完成 | — |
| Step8 | 画像・添付 | 完成（User `img.preview-image` → `[Image]`） | Assistant 画像・非画像ファイルは実機セレクタ記入まで禁止 |
| Step9 | 仮想スクロール / KaTeX 等 | 未着手 | 実機次第。`tasks/deferred/R05-R06` |

---

## 権限（最小）

- `permissions`: `downloads`（Step1 時点）
- `host_permissions`: `https://gemini.google.com/*` のみ（または空＋ matches）
- **禁止**: oauth2、Drive/Dropbox/Notion 等、広い CSP `connect-src`

---

## 参考実装パターン

動作確認済みの別 Gemini エクスポート拡張のロジックを Step6/7/9 で**参考**にする（完全移植しない）。要約は `tasks/deferred/`。

- htmlToMarkdown（コードブロック保護・CSS 切り詰め対策）
- buildFilename（本 DESIGN は禁止文字を `-` 置換）
- downloads（`saveAs: true`）
- KaTeX flatten / スクロール部分取得検出（実機で必要と判明した場合のみ）
