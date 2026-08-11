# R01 — htmlToMarkdown パターン（Step6）

**読むタイミング**: Step6 の `markdown.js`（または同等）実装時のみ。  
**推奨モデル**: Composer 2.5

参考: 既存 Gemini 拡張 `shared.js` 187〜268 付近（動作確認済み）。完全コピー禁止。

## 要点

1. **コードブロック保護**: `<pre>` をプレースホルダー ID に置換 → 後で復元（`innerText` 正規化で空白が消えるため）
2. **class/style 除去**: line-clamp 等で `innerText` が切り詰まるのを防ぐ
3. **要素変換**: h1–h6 / strong|b / code / ol / ul
4. **言語抽出**: `language-(\w+)` または `lang-(\w+)`
5. **不可視除去**: `.sr-only`, `.cdk-visually-hidden`, `.visually-hidden`, `[aria-hidden="true"]`
6. **detached innerText**: 一時的に DOM へ append してから取得し、その後 remove
7. **正規化**: `\n{3,}` → `\n\n`

## 骨格（参考・要プロジェクト仕様に合わせる）

```javascript
function htmlToMarkdown(element) {
  const clone = element.cloneNode(true);

  // 不可視除去 → pre 保護 → inline code → h1-6 → strong/b → ol/ul
  // → class/style 除去 → tempDiv append → innerText → pre 復元 → trim/改行正規化

  const codeBlocks = [];
  clone.querySelectorAll('pre').forEach(pre => {
    const code = pre.querySelector('code') || pre;
    const classAttr = code.getAttribute('class') || '';
    const match = classAttr.match(/language-(\w+)/) || classAttr.match(/lang-(\w+)/);
    const lang = match ? match[1] : '';
    const id = `___CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}___`;
    codeBlocks.push({
      id,
      content: `\n\n\`\`\`${lang}\n${(code.textContent || '').trim()}\n\`\`\`\n\n`,
    });
    pre.replaceWith(document.createTextNode(id));
  });

  // ... 中略: inline code / headings / bold / lists ...

  clone.querySelectorAll('*').forEach(el => {
    el.removeAttribute('class');
    el.removeAttribute('style');
  });

  const tempDiv = document.createElement('div');
  tempDiv.style.cssText =
    'position:absolute;left:-9999px;top:-9999px;width:800px;height:auto;opacity:0;';
  tempDiv.appendChild(clone);
  document.body.appendChild(tempDiv);
  let markdown = clone.innerText || clone.textContent || '';
  document.body.removeChild(tempDiv);

  codeBlocks.forEach(block => {
    markdown = markdown.split(block.id).join(block.content);
  });
  return markdown.trim().replace(/\n{3,}/g, '\n\n');
}
```

## 本プロジェクト差分

- Phase1 / DESIGN の Frontmatter・見出し・ロールラベルに合わせる（参考の `You said` / `Gemini said` をそのまま使わない可能性あり）
- セレクタは **実機確認後の** content 要素を使う
