# Gemini Live Export — 作業タスク INDEX

**作業ルート**: リポジトリ内の `gemini-live-export/`  
**最初にこのファイルだけ読む。** 次に担当 `TASK.md` と、そこに列挙されたファイルだけ読む。

ChatGPT 拡張（リポジトリルートの `src/` 等）は**読まない・変更しない**（別プロダクト）。

---

## モデル割当

| モデル | 使うとき |
|--------|----------|
| **Grok 4.5** | 複数ファイル横断・骨格配線 |
| **Composer 2.5** | 単一ファイル中心・docs 追記 |

---

## 実行順（ゲート付き）

```text
1. Track A (Grok 4.5)  → A-step1-extension-skeleton/TASK.md
2. Track B (Composer 2.5) → B-step2-detect-chat/TASK.md
3. Track C (Composer 2.5) → C-dom-research-prep/TASK.md（dom-research は Step0 で骨子済み。差分確認で可）
4. 【人間】実機確認 → docs/dom-research.md 記入
5. ゲート通過後のみ Step3〜 （deferred/）
```

| # | トラック | 推奨モデル | ブランチ |
|---|----------|------------|----------|
| A | Step1 拡張雛形 | **Grok 4.5** | `feature/extension-skeleton` |
| B | Step2 ページ判定 | **Composer 2.5** | `feature/detect-chat` |
| C | 実機確認準備 | **Composer 2.5** | docs のみ可 |
| — | Step3〜5 | — | **実機確認まで禁止** |

---

## トークン節約

1. 読むのは INDEX → 担当 TASK → TASK 内「読むファイル」のみ
2. `deferred/**` は Step6 以前は開かない
3. ルートの ChatGPT `DESIGN.md` / `src/` は開かない（構造参考が必要なときだけ TASK が明示）

共通制約: [`constraints.md`](./constraints.md)  
完了報告: [`_completion-report.md`](./_completion-report.md)  
コピペ: [`PROMPTS.md`](./PROMPTS.md)
