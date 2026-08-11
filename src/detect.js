/**
 * Gemini chat page detection (URL only — no DOM).
 *
 * Tentative until dom-research confirms URL shapes on real Gemini UI.
 * Supports:
 *   - https://gemini.google.com/app/{id}
 *   - https://gemini.google.com/u/{n}/app/{id}  (candidate; may change after field test)
 *
 * Non-target (false):
 *   - https://gemini.google.com/app        (no chat id segment)
 *   - https://gemini.google.com/           (top / history list)
 *   - non-gemini.google.com hosts
 */

/** @type {RegExp} */
const GEMINI_CHAT_PATH_RE = /^\/(?:u\/\d+\/)?app\/([^/?#]+)\/?$/;

/**
 * @param {string | undefined | null} url
 * @returns {boolean}
 */
function isGeminiChatUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return false;
    }
    if (parsed.hostname !== "gemini.google.com") {
      return false;
    }
    return GEMINI_CHAT_PATH_RE.test(parsed.pathname);
  } catch {
    return false;
  }
}

/**
 * Extract chat id from a Gemini chat URL.
 * Returns null when the URL is not a chat page or id cannot be parsed.
 * Spec is tentative — see docs/dom-research.md after field verification.
 *
 * @param {string | undefined | null} url
 * @returns {string | null}
 */
function extractGeminiChatId(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return null;
    }
    if (parsed.hostname !== "gemini.google.com") {
      return null;
    }
    const match = parsed.pathname.match(GEMINI_CHAT_PATH_RE);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/** @type {{ isGeminiChatUrl: typeof isGeminiChatUrl, extractGeminiChatId: typeof extractGeminiChatId }} */
const GeminiDetect = Object.freeze({
  isGeminiChatUrl,
  extractGeminiChatId,
});
