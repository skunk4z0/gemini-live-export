# deferred/ — Step6 以降まで開かない

このディレクトリのファイルは **Track A/B/C では読まない**。

| ファイル | 使う Step | 推奨モデル目安 |
|----------|-----------|----------------|
| `R01-html-to-markdown.md` | Step6 | Composer 2.5（単一モジュール） |
| `R02-message-assembly.md` | Step6 | Composer 2.5 |
| `R03-filename-sanitize.md` | Step7 | Composer 2.5 |
| `R04-download.md` | Step7 | Grok 4.5（popup↔background 配線） |
| `R05-katex.md` | Step4/5 付近 | Composer 2.5 |
| `R06-scroll-partial.md` | Step4/7/9 | Grok 4.5（検出＋UI 警告） |

**注意**: 参考実装の完全移植はしない。本プロジェクト仕様（Markdown 差分・`saveAs: true`・禁止文字は `-` 置換）に合わせる。
