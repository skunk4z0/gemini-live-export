# R02 — Message 組み立てパターン（Step6）

**読むタイミング**: Step6。**推奨モデル**: Composer 2.5  
参考: `shared.js` exportScrapedChat markdown 分岐 1146〜1190 付近。

## 組み立てイメージ

```text
# {title}

**{roleLabel}**:
{htmlToMarkdown(content)}
{optional images}

---
```

## 注意

- User/Assistant 判定は Step5 完了前提（例: `role-user` / `role-assistant`）
- ロールラベル・区切り・Frontmatter は **本プロジェクト DESIGN / Phase1 差分** に従う（参考実装の文言を固定しない）
- 画像: profile/avatar 除外。`data:` / `blob:` / 長 URL は `[Embedded Image]` 等（DESIGN のプレースホルダー仕様優先）
- `generateMarkdown()` に渡す Message の並び・内容を変更しない（表示順）
