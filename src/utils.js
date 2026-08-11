/**
 * Shared utilities (filename / date helpers).
 *
 * Step7: buildFilename for export downloads.
 * No DOM, no Markdown generation, no chrome.downloads calls.
 */

/**
 * @typedef {Object} BuildFilenameOptions
 * @property {string} [title]
 * @property {string} [ext]
 */

/**
 * Build a safe download filename: `YYYY-MM-DD Title.md`
 * Windows-forbidden characters are replaced with `-` (not deleted).
 *
 * @param {BuildFilenameOptions | null | undefined} options
 * @returns {string}
 */
function buildFilename(options) {
  const title = (options?.title || "Gemini Export").trim() || "Gemini Export";
  const ext = options?.ext || "md";
  const today = new Date().toISOString().split("T")[0];
  const baseName = `${today} ${title}`;

  let sanitized = baseName.replace(/[<>:"/\\|?*]/g, "-");
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  // Collapse duplicated half (repeated title) when lengths match.
  if (sanitized.length >= 4) {
    const len = sanitized.length;
    if (len % 2 === 0 && sanitized.slice(0, len / 2) === sanitized.slice(len / 2)) {
      sanitized = sanitized.slice(0, len / 2).trim();
    }
  }

  return `${sanitized}.${ext}`;
}

/** @type {{ buildFilename: typeof buildFilename }} */
const GeminiUtils = Object.freeze({
  buildFilename,
});
