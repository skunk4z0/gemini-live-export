# Gemini DOM 調査メモ

**重要**: 本ファイルのセレクタはすべて**二次情報の候補**であり、**実機未確認**（記入欄が空の間は実装に使わない）。

実機確認はログイン済み Gemini の DevTools Console で行う。結果はこのファイルの「実機確認結果記入欄」に転記する。

---

## 候補セレクタ（未検証）

| 用途 | 候補 | 備考 |
|------|------|------|
| 会話コンテナ | `.conversation-container`（leave-animation 除外） | 件数確認が必要 |
| User 発話 | `user-query` カスタム要素 | 交互配置の確認 |
| Assistant 発話 | `model-response` | 同上 |
| User テキスト | `.query-text` | innerText 取得 |
| Assistant 本文 | `message-content` / `.markdown` / `.ai-message-body` | 実機で確定 |
| タイトル | `[data-test-id="conversation-title"]` | 他候補も記録 |
| スクローラ | `infinite-scroller`, `.mat-drawer-inner-container`, `main.content-container`, `cdk-virtual-scroll-viewport` | 仮想スクロール有無 |
| KaTeX | `.katex`, `span.base`, `.mord` 等 | あれば flatten 検討 |
| 思考パネル | `[class*="thinking"]`, `[class*="reasoning"]` 等 | assistant 出力から除外するか判定 |

### URL / chat ID（暫定）

| パターン | 例 | 状態 |
|----------|-----|------|
| `/app/{id}` | `/app/abc123` | Step2 主候補 |
| `/u/{n}/app/{id}` | `/u/0/app/abc123` | 候補。未確認 |

---

## 実機確認チェックリスト

- [ ] `.conversation-container` の実在・件数
- [ ] `user-query` / `model-response` の実在・交互配置
- [ ] `.query-text`, `message-content` / `.markdown` のテキスト取得
- [ ] タイトル取得候補の実在
- [ ] URL の chat ID 実パターン（`/app/{id}` vs `/u/n/app/{id}`）
- [ ] タイムスタンプらしき DOM 属性の有無
- [ ] 画像・添付メッセージの DOM
- [ ] 思考過程・reasoning パネルの有無と出力可否
- [ ] 長い会話での `scrollHeight` 変化（仮想スクロール）
- [ ] KaTeX（`.katex`, `.base`, `.mord`）の有無と flatten 可否

**ゲート**: 本チェックが結果付きで埋まるまで Step3〜5 の実装コードを書かない。

---

## 実機確認結果記入欄

- 確認日:
- 確認 URL（pathname）:
- アカウント種別（任意）:

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

```
（ここに貼る）
```

---

## DevTools Console 検証スニペット

ログイン済みのチャットページで実行する。

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
