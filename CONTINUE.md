# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export （独立 repo・`main` に Step0+Step1 済み） |
| 作業クローン | `c:\Dev\Scripts\AI\gemini-live-export` |
| 次の作業ブランチ | `feature/detect-chat`（`main` から作成） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout main
git pull
git checkout -b feature/detect-chat
```

## 今の状態

- Step0 完了（DESIGN / AGENTS / README / dom-research / tasks）
- **Step1 完了**（manifest / popup / background / content / messages / 仮 icons）
  - コミット: `Add extension skeleton`
  - 独立 repo `main` に push 済み
- Step2 未実装
- Step3〜5 は実機確認ゲートでブロック

## 次にやること（順番）

1. ~~Track A Step1~~ ✅ 完了
2. **Track B Step2** — モデル: **Composer 2.5**  
   プロンプト: `tasks/PROMPTS.md` の Track B
3. **Track C** — docs 整備（Composer 2.5）→ **人間が実機確認**
4. ゲート通過後のみ Step3〜

## 新チャットへの貼り付け例（Track B）

```text
CONTINUE.md と tasks/PROMPTS.md の Track B に従って、
Step2 ページ判定（detect.js）を実装してください。
読むファイルは PROMPTS / TASK に列挙されたものだけにしてください。
作業ブランチは feature/detect-chat（なければ main から作成）です。
リポジトリは https://github.com/skunk4z0/gemini-live-export を正とします。
```
