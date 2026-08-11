/**
 * Conversation metadata extraction (DOM + URL).
 *
 * Field-verified selectors only — see docs/dom-research.md (2026-08-11).
 * Step3: metadata only. Message text is Step4 (extract-messages.js).
 *
 * Title: [data-test-id="conversation-title"] failed on real UI;
 * fallback is document.title, then chat id from URL.
 */

/** @type {string} */
const CONVERSATION_CONTAINER_SELECTOR =
  ".conversation-container:not(.conversation-container-leave-animation)";

/**
 * @typedef {Object} Conversation
 * @property {string} [title]
 * @property {string} [id]
 * @property {string} [conversation_id]
 * @property {number} [create_time]
 * @property {number} [update_time]
 * @property {string} [url]
 */

/**
 * @param {string | null | undefined} chatId
 * @returns {string | undefined}
 */
function resolveConversationTitle(chatId) {
  const raw = typeof document !== "undefined" ? document.title?.trim() : "";
  if (raw) {
    const cleaned = raw.replace(/\s*[-–—]\s*Gemini\s*$/i, "").trim();
    if (cleaned && cleaned.toLowerCase() !== "gemini") {
      return cleaned;
    }
  }
  return chatId ?? undefined;
}

/**
 * @returns {boolean}
 */
function hasConversationDom() {
  return document.querySelectorAll(CONVERSATION_CONTAINER_SELECTOR).length > 0;
}

/**
 * @param {string} [href]
 * @returns {Conversation | null}
 */
function extractConversation(href = location.href) {
  if (!GeminiDetect.isGeminiChatUrl(href)) {
    return null;
  }

  if (!hasConversationDom()) {
    return null;
  }

  const chatId = GeminiDetect.extractGeminiChatId(href);
  const title = resolveConversationTitle(chatId);

  /** @type {Conversation} */
  const conversation = {
    url: href,
  };

  if (title) {
    conversation.title = title;
  }
  if (chatId) {
    conversation.id = chatId;
    conversation.conversation_id = chatId;
  }

  return conversation;
}

/** @type {{ extractConversation: typeof extractConversation, hasConversationDom: typeof hasConversationDom }} */
const GeminiExtractConversation = Object.freeze({
  extractConversation,
  hasConversationDom,
});
