/**
 * Message extraction from Gemini chat DOM.
 *
 * Field-verified selectors only — see docs/dom-research.md (2026-08-11).
 * Step4: DOM text extraction in display order. Empty-message exclusion is Step5.
 *
 * Selectors:
 *   - Turns: user-query, model-response (document order)
 *   - User text: .query-text (innerText)
 *   - Assistant text: message-content (innerText)
 */

// Prefix MESSAGE_* — content scripts share one global scope with extract-conversation.js.
/** @type {string} */
const MESSAGE_CONTAINER_SELECTOR =
  ".conversation-container:not(.conversation-container-leave-animation)";

/** @type {string} */
const MESSAGE_TURN_SELECTOR = "user-query, model-response";

/** @type {string} */
const MESSAGE_USER_TEXT_SELECTOR = ".query-text";

/** @type {string} */
const MESSAGE_ASSISTANT_TEXT_SELECTOR = "message-content";

/**
 * @typedef {Object} Message
 * @property {"user" | "assistant"} role
 * @property {string} text
 * @property {string} [messageId]
 * @property {number} [createTime]
 */

/**
 * @param {Element} turn
 * @returns {"user" | "assistant" | null}
 */
function roleFromTurnElement(turn) {
  const tag = turn.tagName.toLowerCase();
  if (tag === "user-query") {
    return "user";
  }
  if (tag === "model-response") {
    return "assistant";
  }
  return null;
}

/**
 * Query light DOM, then open shadowRoot (Gemini custom elements may nest text).
 * @param {Element} root
 * @param {string} selector
 * @returns {Element | null}
 */
function queryInElement(root, selector) {
  const light = root.querySelector(selector);
  if (light) {
    return light;
  }
  if (root.shadowRoot) {
    return root.shadowRoot.querySelector(selector);
  }
  return null;
}

/**
 * @param {Element} turn
 * @returns {string}
 */
function textFromTurnElement(turn) {
  const tag = turn.tagName.toLowerCase();
  if (tag === "user-query") {
    return queryInElement(turn, MESSAGE_USER_TEXT_SELECTOR)?.innerText?.trim() ?? "";
  }
  if (tag === "model-response") {
    return (
      queryInElement(turn, MESSAGE_ASSISTANT_TEXT_SELECTOR)?.innerText?.trim() ?? ""
    );
  }
  return "";
}

/**
 * @returns {boolean}
 */
function hasMessageDom() {
  if (document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR).length === 0) {
    return false;
  }
  return document.querySelectorAll(MESSAGE_TURN_SELECTOR).length > 0;
}

/**
 * @returns {Message[]}
 */
function extractMessages() {
  if (!hasMessageDom()) {
    return [];
  }

  /** @type {Message[]} */
  const messages = [];

  for (const turn of document.querySelectorAll(MESSAGE_TURN_SELECTOR)) {
    const role = roleFromTurnElement(turn);
    if (!role) {
      continue;
    }

    messages.push({
      role,
      text: textFromTurnElement(turn),
    });
  }

  return messages;
}

/** @type {{ extractMessages: typeof extractMessages, hasMessageDom: typeof hasMessageDom }} */
const GeminiExtractMessages = Object.freeze({
  extractMessages,
  hasMessageDom,
});
