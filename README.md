# gemini-live-export（アーカイブ）

> **統合済み**: 新規開発・利用は [chatgpt-live-export](https://github.com/skunk4z0/chatgpt-live-export) の **AI Chat Exporter**（ChatGPT + Gemini 一体拡張）へ移行してください。本リポジトリは参照用アーカイブです。

Gemini で**現在開いている 1 チャット**を Obsidian 用 Markdown として保存する Chrome 拡張（Manifest V3）でした。

> **状態（凍結）**: Step0〜8 完了時点で AI Chat Exporter に統合。

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
