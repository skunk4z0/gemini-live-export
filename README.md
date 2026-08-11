# gemini-live-export

Gemini で**現在開いている 1 チャット**を Obsidian 用 Markdown として保存する Chrome 拡張（Manifest V3）です。

親リポジトリ [chatgpt-live-export](https://github.com/skunk4z0/chatgpt-live-export) 内の**別プロダクト**です。ChatGPT 拡張（リポジトリルート）とはコードを共有しません。

> **状態**: Step0〜7 完了。Step8（User 画像 → `[Image]`）実装済み・実機確認待ち。

---

## 概要

- 対象: `https://gemini.google.com/*`
- 入力: 開いているチャットの DOM（初期）。外部 AI API 不使用
- 出力: Phase1 互換 Markdown + DESIGN 記載の Gemini 差分（`source: Gemini` 等）
- 保存: 毎回「名前を付けて保存」（`saveAs: true`）

---

## ドキュメント

| ファイル | 用途 |
|----------|------|
| [DESIGN.md](./DESIGN.md) | 正式設計 |
| [AGENTS.md](./AGENTS.md) | エージェント向けルール |
| [docs/dom-research.md](./docs/dom-research.md) | DOM 候補・実機確認 |
| [CONTINUE.md](./CONTINUE.md) | **新チャット再開手順** |
| [tasks/00-INDEX.md](./tasks/00-INDEX.md) | 作業タスク INDEX |

---

## インストール（Step1 以降）

1. 本ディレクトリで拡張骨格を実装（Step1）
2. Chrome `chrome://extensions/` → デベロッパーモード
3. 「パッケージ化されていない拡張機能を読み込む」で **`gemini-live-export` フォルダ**を選択（リポジトリルートではない）

---

## 開発の進め方

1. `CONTINUE.md` を開く
2. 推奨モデルに切り替え
3. `tasks/PROMPTS.md` の該当プロンプトを投げる

**Step3〜5 は `docs/dom-research.md` に実機結果が書き込まれるまで着手しない。**
