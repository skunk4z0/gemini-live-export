# Gemini DOM 調査メモ

**重要**: 2026-08-11 実機結果あり。**Step3〜5 コア（Message/Role）はゲート通過**。タイトル代替・仮想スクロール実験・添付の詳細は TODO（下記）。未確認セレクタは実装に使わない。

実機確認はログイン済み Gemini の DevTools Console で行う。結果はこのファイルの「実機確認結果記入欄」に転記する。

---

## 候補セレクタ（実機反映済み・一部 TODO）


| 用途           | 候補                                                                                                          | 備考                    |
| ------------ | ----------------------------------------------------------------------------------------------------------- | --------------------- |
| 会話コンテナ       | `.conversation-container`（leave-animation 除外）                                                               | 実機: 6 件               |
| User 発話      | `user-query` カスタム要素                                                                                         | 実機: 交互 true           |
| Assistant 発話 | `model-response`                                                                                            | 実機: 交互 true           |
| User テキスト    | `.query-text`                                                                                               | 実機: innerText 取得可     |
| Assistant 本文 | **`message-content`**（実機確定）                                                                                 | `.markdown` / `.ai-message-body` は未使用でも可 |
| タイトル         | `[data-test-id="conversation-title"]` **実機で失敗**                                                            | 代替未取得。暫定は chat ID / `document.title` |
| スクローラ        | `infinite-scroller`, `.mat-drawer-inner-container`, `main.content-container`, `cdk-virtual-scroll-viewport` | 有効 1（scrollHeight≫clientHeight） |
| KaTeX        | `.katex`, `span.base`, `.mord` 等                                                                            | この会話では 0。数式会話で再確認任意  |
| 思考パネル        | `[class*="thinking"]` は **誤検出あり**                                                                           | `thinking-level-enabled`（UI）にヒット。本文除外に使わない |
| User 画像プレビュー  | `user-query img.preview-image`                                                                              | **Step8 実機確定**（alt: アップロードされた画像のプレビュー） |
| ページ全体 upload UI | `xap-uploader-dropzone` / `[class*="upload"]`                                                               | **メッセージ添付ではない**（チャット全体ドロップゾーン）。除外 |




### URL / chat ID（暫定）


| パターン              | 例                 | 状態        |
| ----------------- | ----------------- | --------- |
| `/app/{id}`       | `/app/abc123`     | Step2 主候補（今回の実機は `/u/n/` 付き） |
| `/u/{n}/app/{id}` | `/u/0/app/2494c648dd7eb4af` | **実機確認済み** |


---



## 実機確認チェックリスト

- [x] `.conversation-container` の実在・件数（6）
- [x] `user-query` / `model-response` の実在・交互配置（`alternating? true`）
- [x] `.query-text`, `message-content` のテキスト取得
- [ ] タイトル取得候補（現行失敗・代替未。暫定フォールバック可）
- [x] URL の chat ID 実パターン（`/u/0/app/{id}`）
- [x] タイムスタンプらしき DOM（候補セレクタでは 0）
- [x] 画像・添付（User: `img.preview-image` 確定。Assistant 生成画像・非画像ファイルは未確認）
- [x] 思考パネル（`[class*="thinking"]` は UI 誤検出。本文除外に使わない）
- [ ] 長い会話での `scrollHeight` 変化（仮想スクロール実験・Step9）
- [x] KaTeX（この会話では 0）

**ゲート**: Step3〜5 コア（Message/Role）は通過。タイトル代替・仮想スクロールは TODO のまま実装可（タイトルは chat ID フォールバック）。  
**Step8 ゲート**: User 画像プレビューは通過（`img.preview-image`）。Assistant 画像・非画像ファイルは未確認のためプレースホルダー実装しない。

---



## 実機確認結果記入欄

- 確認日: 2026-08-11
- 確認 URL（pathname）: `/u/0/app/2494c648dd7eb4af`
- アカウント種別（任意）: （未記入）

### セレクタ実在

| 候補 | 実在? | 実クラス/属性 | 件数 | メモ |
|------|-------|---------------|------|------|
| .conversation-container | はい | （未記録） | 6 | |
| user-query | はい | | 6 | |
| model-response | はい | | 6 | |
| .query-text | はい | `.query-text` | ≥1 | User テキスト取得成功 |
| message-content / .markdown | **はい** | `MESSAGE-CONTENT` + `ng-star-inserted` | ≥1 | **実装は `message-content` を使う** |
| [data-test-id="conversation-title"] | **いいえ** | — | 0 | 代替未取得（`$0` も未選択で失敗） |
| KaTeX (.katex / .base / .mord) | なし（この会話） | | 0 | |
| infinite-scroller 等 | はい（有効 1） | （tag/class 未記録） | 候補 3 | #2 のみ有効 `scrollHeight=14684` |
| thinking/reasoning | **誤検出** | `DIV.logo-pill-label-container ... thinking-level-enabled` | 1 | 本物の思考パネルではない |

### 交互配置・テキスト

- user / model は交互か: **true**
- User テキスト取得セレクタ・先頭 100 文字: `.query-text` → `あなたのプロンプト / バイブコーディングの私から質問です / ...`
- Assistant テキスト取得セレクタ・先頭 100 文字: `message-content` → `結論からお伝えすると、Chrome拡張機能のコードは知識があれば誰でも100%完全に解析・閲覧・書き換えが可能です。...`

### URL / ID

- 実 pathname: `/u/0/app/2494c648dd7eb4af`
- `/u/n/` prefix: **あり**（`/u/0/`）
- 抽出できた ID: `2494c648dd7eb4af`

### タイムスタンプ

- らしき属性・要素: **なし**（候補セレクタで 0）
- 見つかったセレクタ・属性名: —
- メモ: MVP ではタイムスタンプなしで可

### 画像・添付

- サンプル有無: **あり**（User 画像アップロード 1 件 / 2026-08-11）
- 見つかった DOM: `user-query img.preview-image`（http, 512×221）
- メモ: `pageAttachish` の `[class*="upload"]` は `xap-uploader-dropzone`（チャット全体）に誤ヒット → **添付セレクタに使わない**

#### Step8 実機記入欄（**画像 or ファイルを送った会話**で再実行）

テキストのみの会話ではスニペット 11 は `mediaTurns: 0` で終わり、詳細行は出ない（正常）。  
先に Gemini へ画像アップロード or ファイル添付したチャットを開き、そのタブの Console で実行する。

- 日付 / URL pathname: 2026-08-11 / `/u/0/app/19470dc984cc0602`
- User 添付（ファイル）のタグ名・主要 class / data-*: **画像のみ確認** → `img.preview-image`（alt=`アップロードされた画像のプレビュー`）。非画像ファイルは未確認
- Assistant 生成画像のタグ名・主要 class / data-*: **未確認**（このサンプルでは turn 内なし）
- avatar / profile と本文画像の区別方法: ターン内は `preview-image` のみ採用。ページ全体の他 `img`（7）は UI/avatar 候補のため無視
- `src` の典型（https / data / blob）: **http**（このサンプル）
- Console 生ログ（下記スニペット結果を貼付）:

```
[Step8] START
[Step8] summary {pathname: '/u/0/app/19470dc984cc0602', containers: 2, turns: 4, pageImgs: 7, pageAttachish: 1}
[Step8] pageAttachish[0] DIV xap-uploader-dropzone chat-container ...
[Step8] --- turn[2] user-query imgs=1 attachish=0 ---
[Step8] img[0] {className: 'preview-image', alt: 'アップロードされた画像のプレビュー', w: 512, h: 221, srcKind: 'http', …}
[Step8] mediaTurns: 1
[Step8] END
```
### 仮想スクロール

- scrollHeight は変化したか: **未実験**（1 スナップショットのみ）
- 部分取得の可能性: あり得る（scrollHeight ≫ clientHeight）
- スクロール前後の件数差（あれば）: 未計測 → Step9

### 思考パネル

- 実在: **本物は未確認**（ヒットは UI の `thinking-level-enabled`）
- assistant 出力に含めるべきでないか: 現状の曖昧セレクタでは除外しない
- メモ: `[class*="thinking"]` を除外条件に使わないこと

### Console 生ログ（貼付）

```
# 初回（短縮版）
conversation-container count: 6
user-query count: 6
model-response count: 6
First user message text: あなたのプロンプト ...
Title: undefined
pathname: /u/0/app/2494c648dd7eb4af
chat ID: 2494c648dd7eb4af
katex: 0 / span.base: 0
scrollers: 3（#2 のみ有効 scrollHeight=14684）
thinking/reasoning panels: 1

# 不足分
turn order (first 20): user-query, model-response ×6
alternating? true
First assistant found? true
First assistant tag/class: MESSAGE-CONTENT ng-star-inserted
First assistant text: 結論からお伝えすると、Chrome拡張機能のコードは...
Title candidate: undefined
reasoning[0]: DIV logo-pill-label-container lm-redesign-enabled thinking-level-enabled ...
time-like elements: 0
images in turns: 0
attachment-like: 3
$0.tagName → TypeError（Elements で未選択）
```

---



## DevTools Console 検証スニペット

ログイン済みの**チャットページ**で実行する。長い会話がある場合は、スクロール前後で 7 を再実行するとよい。

### 不足分だけ（再実行用・短い）

既に件数・URL・User テキストが取れた場合は、**このブロックだけ** Console に貼って結果を送ればよい。

成功すると次の行が出る（これが出なければ古いコードを実行している）:
`alternating?` / `First assistant` / `time-like` / `images in turns`

```javascript
// === Gemini DOM 不足分のみ ===
const turns = [...document.querySelectorAll('user-query, model-response')].map((el) => el.tagName.toLowerCase());
console.log('turn order (first 20):', turns.slice(0, 20));
console.log('alternating?', turns.every((t, i) => t === (i % 2 === 0 ? 'user-query' : 'model-response')));

const firstAssistant =
  document.querySelector('message-content') ||
  document.querySelector('.markdown') ||
  document.querySelector('.ai-message-body');
console.log('First assistant found?', !!firstAssistant);
console.log('First assistant tag/class:', firstAssistant?.tagName, firstAssistant?.className);
console.log('First assistant text:', firstAssistant?.innerText?.substring(0, 100));

// タイトル候補が undefined のとき: 画面上の会話タイトルを右クリック→検証し、
// 選択中要素で次を実行（Elements でタイトルをクリックした状態）
console.log('Title candidate:', document.querySelector('[data-test-id="conversation-title"]')?.textContent);
console.log('$0 (Inspectで選択中):', $0?.tagName, $0?.getAttribute?.('data-test-id'), $0?.className, $0?.textContent?.trim()?.substring(0, 80));

const reasoningPanels = document.querySelectorAll(
  '[class*="thinking"], [class*="reasoning"], [data-testid*="thinking"], [data-testid*="reasoning"]'
);
console.log('thinking/reasoning panels:', reasoningPanels.length);
reasoningPanels.forEach((el, i) => {
  if (i < 5) console.log(`reasoning[${i}]:`, el.tagName, String(el.className).substring(0, 80));
});

const timeCandidates = document.querySelectorAll(
  'time, [datetime], [data-timestamp], [aria-label*="time" i], [aria-label*="日時"], [class*="timestamp"], [class*="time-"]'
);
console.log('time-like elements:', timeCandidates.length);
[...timeCandidates].slice(0, 5).forEach((el, i) => {
  console.log(`time[${i}]:`, el.tagName, el.getAttribute('datetime') || el.getAttribute('data-timestamp') || el.getAttribute('aria-label') || el.className);
});

const imgs = document.querySelectorAll('user-query img, model-response img, .conversation-container img');
const attachments = document.querySelectorAll(
  '[class*="attachment"], [class*="upload"], [data-test-id*="attachment"], [data-testid*="attachment"]'
);
console.log('images in turns:', imgs.length);
console.log('attachment-like:', attachments.length);
```

### 全文スニペット

```javascript
// === Gemini DOM 検証スニペット ===

// 1. conversation-container
console.log('conversation-container count:',
  document.querySelectorAll('.conversation-container:not(.conversation-container-leave-animation)').length);

// 2. user-query / model-response（件数と交互配置）
const userQueries = document.querySelectorAll('user-query');
const modelResponses = document.querySelectorAll('model-response');
console.log('user-query count:', userQueries.length);
console.log('model-response count:', modelResponses.length);
const turns = [...document.querySelectorAll('user-query, model-response')].map((el) => el.tagName.toLowerCase());
console.log('turn order (first 20):', turns.slice(0, 20));
console.log('alternating?', turns.every((t, i) => t === (i % 2 === 0 ? 'user-query' : 'model-response')));

// 3. テキスト取得（user / assistant）
const firstUser = document.querySelector('.query-text');
console.log('First user (.query-text):', firstUser?.innerText?.substring(0, 100));
const firstAssistant =
  document.querySelector('message-content') ||
  document.querySelector('.markdown') ||
  document.querySelector('.ai-message-body');
console.log('First assistant tag/class:', firstAssistant?.tagName, firstAssistant?.className);
console.log('First assistant text:', firstAssistant?.innerText?.substring(0, 100));

// 4. タイトル
const titleEl = document.querySelector('[data-test-id="conversation-title"]');
console.log('Title:', titleEl?.textContent);

// 5. chat ID
const pathname = window.location.pathname;
console.log('pathname:', pathname);
const idMatch = pathname.match(/(?:\/u\/\d+)?\/app\/([a-z0-9]+)/i);
console.log('chat ID:', idMatch ? idMatch[1] : 'NOT FOUND');
console.log('has /u/n/ prefix:', /\/u\/\d+\//.test(pathname));

// 6. KaTeX
console.log('katex:', document.querySelectorAll('.katex').length);
console.log('span.base:', document.querySelectorAll('span.base').length);
console.log('.mord:', document.querySelectorAll('.mord').length);

// 7. スクローラ
const scrollers = document.querySelectorAll(
  'infinite-scroller, .mat-drawer-inner-container, main.content-container, cdk-virtual-scroll-viewport'
);
console.log('scrollers:', scrollers.length);
scrollers.forEach((s, i) => {
  console.log(`Scroller ${i}: tag=${s.tagName} class=${s.className} scrollHeight=${s.scrollHeight}, clientHeight=${s.clientHeight}, scrollTop=${s.scrollTop}`);
});

// 8. 思考パネル
const reasoningPanels = document.querySelectorAll(
  '[class*="thinking"], [class*="reasoning"], [data-testid*="thinking"], [data-testid*="reasoning"]'
);
console.log('thinking/reasoning panels:', reasoningPanels.length);
reasoningPanels.forEach((el, i) => {
  if (i < 5) console.log(`reasoning[${i}]:`, el.tagName, el.className?.substring?.(0, 80));
});

// 9. タイムスタンプらしき属性
const timeCandidates = document.querySelectorAll(
  'time, [datetime], [data-timestamp], [aria-label*="time" i], [aria-label*="日時"], [class*="timestamp"], [class*="time-"]'
);
console.log('time-like elements:', timeCandidates.length);
[...timeCandidates].slice(0, 5).forEach((el, i) => {
  console.log(`time[${i}]:`, el.tagName, el.getAttribute('datetime') || el.getAttribute('data-timestamp') || el.getAttribute('aria-label') || el.className);
});

// 10. 画像・添付（初回）
const imgs = document.querySelectorAll('user-query img, model-response img, .conversation-container img');
const attachments = document.querySelectorAll(
  '[class*="attachment"], [class*="upload"], [data-test-id*="attachment"], [data-testid*="attachment"]'
);
console.log('images in turns:', imgs.length);
console.log('attachment-like:', attachments.length);
[...imgs].slice(0, 3).forEach((img, i) => {
  console.log(`img[${i}]:`, img.src?.substring(0, 80), 'alt=', img.alt);
});

// 11. Step8 詳細（画像・ファイル付き会話で実行）
// 期待: 最低でも [Step8] START / summary / END が必ず出る。
// mediaTurns: 0 → この会話にターン内メディアなし（別チャットで再実行）。
(function () {
  console.log('[Step8] START');
  const containers = document.querySelectorAll('.conversation-container');
  const turns = [...document.querySelectorAll('user-query, model-response')];
  const pageImgs = [...document.querySelectorAll('img')];
  const pageAttachish = [...document.querySelectorAll(
    '[class*="attachment"], [class*="upload"], [data-test-id*="attachment"], [data-testid*="attachment"], a[download]'
  )];
  console.log('[Step8] summary', {
    pathname: location.pathname,
    containers: containers.length,
    turns: turns.length,
    pageImgs: pageImgs.length,
    pageAttachish: pageAttachish.length
  });

  pageAttachish.slice(0, 10).forEach((el, i) => {
    console.log(`[Step8] pageAttachish[${i}]`, el.tagName, String(el.className).slice(0, 120),
      el.getAttribute('data-test-id') || el.getAttribute('data-testid') || '',
      (el.textContent || '').trim().slice(0, 60));
  });

  let mediaTurns = 0;
  turns.forEach((turn, ti) => {
    const role = turn.tagName.toLowerCase();
    const imgs = [...turn.querySelectorAll('img')];
    const attachish = [...turn.querySelectorAll(
      '[class*="attachment"], [class*="upload"], [data-test-id*="attachment"], [data-testid*="attachment"], a[download]'
    )];
    if (!imgs.length && !attachish.length) return;
    mediaTurns += 1;
    console.log(`[Step8] --- turn[${ti}] ${role} imgs=${imgs.length} attachish=${attachish.length} ---`);
    imgs.forEach((img, i) => {
      const src = img.currentSrc || img.src || '';
      console.log(`[Step8] img[${i}]`, {
        className: String(img.className).slice(0, 120),
        alt: img.alt,
        w: img.naturalWidth || img.width,
        h: img.naturalHeight || img.height,
        srcKind: src.startsWith('data:') ? 'data' : src.startsWith('blob:') ? 'blob' : src.startsWith('http') ? 'http' : 'other',
        srcHead: src.slice(0, 100),
        parent: img.parentElement && `${img.parentElement.tagName}.${String(img.parentElement.className).slice(0, 80)}`
      });
    });
    attachish.slice(0, 8).forEach((el, i) => {
      console.log(`[Step8] attachish[${i}]`, el.tagName, String(el.className).slice(0, 100),
        el.getAttribute('data-test-id') || el.getAttribute('data-testid') || '',
        (el.textContent || '').trim().slice(0, 60));
    });
  });

  console.log('[Step8] mediaTurns:', mediaTurns);
  if (mediaTurns === 0) {
    console.warn('[Step8] ターン内に画像/添付なし。Gemini に画像かファイルを送った会話を開いて再実行してください。');
  }
  console.log('[Step8] END');
})();
```

