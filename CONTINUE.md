# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| リポジトリ | `chatgpt-live-export`（モノレポ） |
| Gemini ルート | `gemini-live-export/` |
| 推奨開始ブランチ | `feature/gemini-bootstrap`（push 済み） |
| Step1 作業ブランチ | ここから `feature/extension-skeleton` を切る |

```powershell
cd c:\Dev\Scripts\AI\chatgpt-live-export
git fetch
git checkout feature/gemini-bootstrap
git pull
git checkout -b feature/extension-skeleton
```

## 今の状態

- Step0 完了（DESIGN / AGENTS / README / dom-research / tasks）
- Step1・2 未実装
- Step3〜5 は実機確認ゲートでブロック

## 次にやること（順番）

1. **Track A Step1** — モデル: **Grok 4.5**  
   プロンプト: `gemini-live-export/tasks/PROMPTS.md` の Track A
2. **Track B Step2** — モデル: **Composer 2.5**  
   プロンプト: 同ファイル Track B
3. **Track C** — docs 整備（Composer 2.5）→ **人間が実機確認**
4. ゲート通過後のみ Step3〜

## 新チャットへの貼り付け例

```text
gemini-live-export/CONTINUE.md と gemini-live-export/tasks/PROMPTS.md の Track A に従って、
Step1 拡張雛形を実装してください。読むファイルは PROMPTS / TASK に列挙されたものだけにしてください。
作業ブランチは feature/extension-skeleton（なければ gemini-bootstrap から作成）です。
```
