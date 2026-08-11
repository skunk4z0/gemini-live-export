/**
 * Download helpers for the service worker.
 *
 * Step7: write Markdown text via chrome.downloads only.
 * Does not modify Markdown content. Filename comes from utils.js.
 *
 * MV3 service workers lack URL.createObjectURL, so we use a data: URL
 * instead of Blob → Object URL (see tasks/deferred/R04).
 */

/**
 * @typedef {Object} DownloadTextFileOptions
 * @property {string} content
 * @property {string} filename
 * @property {string} [mimeType]
 */

/**
 * Download a text file with saveAs dialog.
 * @param {DownloadTextFileOptions} options
 * @returns {Promise<number>} chrome.downloads download id
 */
async function downloadTextFile(options) {
  const content = options?.content;
  const filename = options?.filename;
  if (typeof content !== "string" || content.length === 0) {
    throw new Error("download content is empty");
  }
  if (typeof filename !== "string" || !filename.trim()) {
    throw new Error("download filename is missing");
  }

  const mimeType = options.mimeType || "text/markdown;charset=utf-8";
  const url = `data:${mimeType},${encodeURIComponent(content)}`;

  const downloadId = await chrome.downloads.download({
    url,
    filename: filename.trim(),
    saveAs: true,
    conflictAction: "uniquify",
  });

  if (typeof downloadId !== "number") {
    throw new Error("chrome.downloads.download failed");
  }

  return downloadId;
}

/** @type {{ downloadTextFile: typeof downloadTextFile }} */
const GeminiDownload = Object.freeze({
  downloadTextFile,
});
