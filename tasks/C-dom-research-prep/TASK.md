# Track C — 実機確認の準備（Cursor） / 実施（人間）

| 項目 | 値 |
|------|-----|
| **推奨モデル** | **Composer 2.5**（docs 単一ファイル編集） |
| **ブランチ** | docs 変更のみなら A/B ブランチ上でも可。専用なら `docs/dom-research-prep` |
| **Cursor の役割** | 準備のみ（検証スニペット・記入欄） |
| **人間の役割** | ログイン済み Gemini で DevTools 実行・結果転記 |

## 読むファイル（これだけ）

1. `gemini-live-export/tasks/constraints.md`
2. **このファイル**
3. `gemini-live-export/docs/dom-research.md`（Step0 で骨子済み。不足の追記のみ）

## 読まない

- `tasks/deferred/**`（中のスニペット要約は本ファイルに必要分を既に含む）
- Step3〜5 の実装コードを書き始めない
- 参考実装の全文

---

## Cursor がやること

### 1. チェックリストが網羅されているか確認・不足を追記

- [ ] `.conversation-container` 実在・件数
- [ ] `user-query` / `model-response` 実在・交互配置
- [ ] `.query-text`, `message-content` / `.markdown` のテキスト取得
- [ ] タイトル候補（`[data-test-id="conversation-title"]` 等）
- [ ] URL の chat ID 実パターン（`/app/{id}` vs `/u/n/app/{id}`）
- [ ] タイムスタンプらしき DOM 属性の有無
- [ ] 画像・添付メッセージの DOM（サンプルがあれば）
- [ ] 思考過程・reasoning パネルの有無と、assistant 出力に含めるべきでないか
- [ ] 長い会話で `infinite-scroller` 等の `scrollHeight` 変化（仮想スクロール）
- [ ] KaTeX（`.katex`, `.base`, `.mord` 等）の有無と flatten 可否

### 2. 「実機確認結果記入欄」テンプレートを `docs/dom-research.md` に追加

空欄でよい。人間がコピペしやすい見出し構造にする。

### 3. DevTools Console 用スニペットを追記

以下をベースに、不足があれば足す（**実装コードにはしない**）:

```javascript
// === Gemini DOM 検証スニペット ===

// 1. conversation-container
console.log('conversation-container count:',
  document.querySelectorAll('.conversation-container:not(.conversation-container-leave-animation)').length);

// 2. user-query / model-response
const userQueries = document.querySelectorAll('user-query');
const modelResponses = document.querySelectorAll('model-response');
console.log('user-query count:', userQueries.length);
console.log('model-response count:', modelResponses.length);

// 3. テキスト取得
const firstMessage = document.querySelector('.query-text');
console.log('First user message text:', firstMessage?.innerText?.substring(0, 100));

// 4. タイトル
const titleEl = document.querySelector('[data-test-id="conversation-title"]');
console.log('Title:', titleEl?.textContent);

// 5. chat ID
const pathname = window.location.pathname;
console.log('pathname:', pathname);
const idMatch = pathname.match(/app\/([a-z0-9]+)/i);
console.log('chat ID:', idMatch ? idMatch[1] : 'NOT FOUND');

// 6. KaTeX
console.log('katex:', document.querySelectorAll('.katex').length);
console.log('span.base:', document.querySelectorAll('span.base').length);

// 7. スクローラ
const scrollers = document.querySelectorAll(
  'infinite-scroller, .mat-drawer-inner-container, main.content-container, cdk-virtual-scroll-viewport'
);
console.log('scrollers:', scrollers.length);
scrollers.forEach((s, i) => {
  console.log(`Scroller ${i}: scrollHeight=${s.scrollHeight}, clientHeight=${s.clientHeight}, scrollTop=${s.scrollTop}`);
});

// 8. 思考パネル
const reasoningPanels = document.querySelectorAll(
  '[class*="thinking"], [class*="reasoning"], [data-testid*="thinking"], [data-testid*="reasoning"]'
);
console.log('thinking/reasoning panels:', reasoningPanels.length);
```

### 記入欄テンプレ例（docs に追加）

```markdown
## 実機確認結果（記入欄）

- 確認日:
- 確認 URL（pathname）:
- アカウント種別（Free/Pro 等・任意）:

### セレクタ実在

| 候補 | 実在? | 実クラス/属性 | 件数 | メモ |
|------|-------|---------------|------|------|
| .conversation-container | | | | |
| user-query | | | | |
| model-response | | | | |
| .query-text | | | | |
| message-content / .markdown | | | | |
| [data-test-id="conversation-title"] | | | | |
| KaTeX (.katex) | | | | |
| infinite-scroller 等 | | | | |
| thinking/reasoning | | | | |

### URL / ID

- 実 pathname:
- `/u/n/` prefix: あり / なし
- 抽出できた ID:

### 仮想スクロール

- scrollHeight は変化したか:
- 部分取得の可能性:

### Console 生ログ（貼付）

\`\`\`
（ここに貼る）
\`\`\`
```

---

## 人間がやること（Cursor への依頼ではない）

1. ログイン済み Gemini でスニペット実行
2. 結果を記入欄へ転記
3. 候補と違う class / 属性があれば併記
4. 長い会話でスクロール実験

## ゲート（重要）

**記入欄に結果が入るまで Step3〜5 のコードを書かない。**  
候補と実機が違う場合は DESIGN.md の該当記載も更新する（別タスク可）。

## Cursor 完了条件

- [ ] チェックリストが docs にある
- [ ] 記入欄テンプレがある
- [ ] 検証スニペットがある
- [ ] Step3〜5 の実装ファイルを追加していない

## コミットメッセージ例（docs のみの場合）

```text
Add Gemini DOM research verification template
```
