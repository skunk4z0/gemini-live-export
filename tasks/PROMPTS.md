# コピペ用プロンプト（モデル切替）

作業ディレクトリは常に **`gemini-live-export/`** 配下。ルートの ChatGPT 拡張は触らない。

---

## Track A（Grok 4.5）

```text
gemini-live-export/CONTINUE.md を確認し、
gemini-live-export/tasks/00-INDEX.md と
gemini-live-export/tasks/A-step1-extension-skeleton/TASK.md と
gemini-live-export/tasks/constraints.md だけ読んで、
Track A（Step1 拡張雛形）を gemini-live-export/ 配下に実装してください。
deferred/ と Step3 以降とリポジトリルートの ChatGPT src は触らないでください。
ブランチは feature/extension-skeleton（なければ feature/gemini-bootstrap から作成）。
完了後は tasks/_completion-report.md の Step1 項目を報告してください。
```

---

## Track B（Composer 2.5）

```text
gemini-live-export/tasks/B-step2-detect-chat/TASK.md と
gemini-live-export/tasks/constraints.md だけ読んで、
Track B（detect.js）を gemini-live-export/ 配下に実装してください。
DOM 取得・Step3 以降・deferred/・ルートの ChatGPT コードは禁止です。
完了後は完了報告の Step2 項目を埋めてください。
```

---

## Track C（Composer 2.5）

```text
gemini-live-export/tasks/C-dom-research-prep/TASK.md と
gemini-live-export/tasks/constraints.md と
gemini-live-export/docs/dom-research.md だけ読んで、
実機確認用チェックリスト・記入欄・スニペットの不足があれば追記してください。
Step3〜5 の実装コードは書かないでください。
```

---

## ゲート確認（実機記入後 / Grok 4.5）

```text
gemini-live-export/docs/dom-research.md の実機確認結果記入欄を読み、
Step3 着手可否を判定してください。未記入・矛盾があれば着手不可とし不足点を列挙してください。
```
