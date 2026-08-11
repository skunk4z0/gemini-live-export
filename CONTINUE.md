# 新チャット再開用（CONTINUE）

このファイルを新チャットの最初のコンテキストにする。

## リポジトリ / ブランチ

| 項目 | 値 |
|------|-----|
| **正式リポジトリ** | https://github.com/skunk4z0/gemini-live-export （独立 repo・`main` に Step0+Step1 済み） |
| 作業クローン推奨 | `c:\Dev\Scripts\AI\gemini-live-export` |
| 次の作業ブランチ | `feature/detect-chat`（Step2 作業中 or 完了後 merge） |

```powershell
cd c:\Dev\Scripts\AI\gemini-live-export
git fetch
git checkout main
git pull
git checkout -b feature/detect-chat   # 未作成の場合
```

## 今の状態

- Step0 完了（DESIGN / AGENTS / README / dom-research / tasks）
- **Step1 完了**（manifest / popup / background / content / messages / 仮 icons）
- **Step2 完了**（`detect.js` + content / popup / manifest 配線）
  - コミット予定: `Detect Gemini chat page`
- Step3〜5 は実機確認ゲートでブロック

## 次にやること（順番）

1. ~~Track A Step1~~ ✅ 完了
2. ~~Track B Step2~~ ✅ 完了（`detect.js`）
3. **Track C** — docs 整備（Composer 2.5）→ **人間が実機確認**
4. ゲート通過後のみ Step3〜

## 新チャットへの貼り付け例（Track C）

```text
CONTINUE.md と tasks/PROMPTS.md の Track C に従って、
docs/dom-research.md の実機確認用チェックリストを整備してください。
読むファイルは PROMPTS / TASK に列挙されたものだけにしてください。
Step3〜5 の実装コードは書かないでください。
```
