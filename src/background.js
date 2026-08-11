/**
 * Service Worker.
 * Step7: DOWNLOAD_FILE → filename sanitize + chrome.downloads (saveAs: true).
 */
importScripts("messages.js", "utils.js", "download.js");

chrome.runtime.onInstalled.addListener(() => {
  console.log("[gemini-live-export] service worker installed");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== "string") {
    return;
  }

  if (message.type === Messages.PING) {
    sendResponse({ type: Messages.PONG, ok: true });
    return true;
  }

  if (message.type === Messages.DOWNLOAD_FILE) {
    handleDownloadFile(message)
      .then((result) => {
        sendResponse({ type: Messages.PONG, ok: true, ...result });
      })
      .catch((err) => {
        sendResponse({
          type: Messages.PONG,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      });
    return true;
  }

  return;
});

/**
 * @param {{ content?: unknown, title?: unknown, filename?: unknown, ext?: unknown }} message
 * @returns {Promise<{ filename: string, downloadId: number }>}
 */
async function handleDownloadFile(message) {
  const content = typeof message.content === "string" ? message.content : "";
  if (!content) {
    throw new Error("download content is empty");
  }

  const filename =
    typeof message.filename === "string" && message.filename.trim()
      ? message.filename.trim()
      : GeminiUtils.buildFilename({
          title: typeof message.title === "string" ? message.title : undefined,
          ext: typeof message.ext === "string" ? message.ext : undefined,
        });

  const downloadId = await GeminiDownload.downloadTextFile({
    content,
    filename,
  });

  return { filename, downloadId };
}
