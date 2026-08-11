# R04 — ダウンロード実装（Step7）

**読むタイミング**: Step7。**推奨モデル**: Grok 4.5（content/popup ↔ background）  
参考: `background.js` handleDownloadFile 507〜570。

## フロー

1. Content/Popup → `chrome.runtime.sendMessage({ action: 'DOWNLOAD_FILE', ... })`
2. Background で Blob → Object URL → `chrome.downloads.download({ saveAs: true })`
3. 成功後 `URL.revokeObjectURL`（60秒以上待ってから）

## 必須差分

- **`saveAs: true`**（毎回ダイアログ）
- ファイル名は R03（禁止文字は `-` 置換）
- クラウド同期・外部 host は使わない
- Markdown 文字列をダウンロード前に加工しない

## 権限

- `permissions` に `downloads`（Step1 で付与済み想定）
