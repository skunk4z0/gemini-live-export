# R05 — KaTeX flatten（Step4 付近）

**読むタイミング**: 実機で KaTeX 確認後、Message 取得時。**推奨モデル**: Composer 2.5  
参考: `gemini.js` flattenKatexElements 265〜313。

## いつ使うか

Track C で `.katex` / `span.base` が実在した場合のみ。未確認なら実装しない。

## 戦略（要約）

1. `.katex` → `annotation` の TeX、なければ textContent
2. 裸の `span.base`（`.mord` 等を子に持つ）→ テキスト化（strut/mspace 除く）
3. `.katex-html` → textContent

呼び出し: `htmlToMarkdown()` の直前。
