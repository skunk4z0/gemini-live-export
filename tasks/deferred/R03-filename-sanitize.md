# R03 — ファイル名生成・サニタイズ（Step7）

**読むタイミング**: Step7。**推奨モデル**: Composer 2.5  
参考: `background.js` buildFilename 281〜381。**差異に注意。**

## 本プロジェクト仕様

```javascript
async function buildFilename(options) {
  const title = (options?.title || 'Gemini Export').trim();
  const ext = options?.ext || 'md';
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const baseName = `${today} ${title}`;

  // DESIGN: 禁止文字は削除ではなく '-' 置換
  let sanitized = baseName.replace(/[<>:"/\\|?*]/g, '-');
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // 重複タイトル短縮（参考ロジック）
  if (sanitized.length >= 4) {
    const len = sanitized.length;
    if (len % 2 === 0 && sanitized.slice(0, len / 2) === sanitized.slice(len / 2)) {
      sanitized = sanitized.slice(0, len / 2).trim();
    }
  }
  return `${sanitized}.${ext}`;
}
```

## 参考実装との差異

| 項目 | 参考 | 本プロジェクト |
|------|------|----------------|
| 禁止文字 | 削除 | **`-` 置換** |
| saveAs | false が多い | **true**（R04） |
