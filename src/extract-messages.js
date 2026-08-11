/**
 * Message extraction from Gemini chat DOM.
 *
 * Field-verified selectors only — see docs/dom-research.md (2026-08-11).
 * Step4: DOM text extraction in display order. Empty-message exclusion is Step5.
 * Step8: User image preview → DESIGN placeholder `[Image]`.
 *
 * Selectors:
 *   - Turns: user-query, model-response (document order)
 *   - User text: .query-text (innerText)
 *   - Assistant text: message-content (innerText)
 *   - User image: img.preview-image (verified). Do not use [class*="upload"] (dropzone FP).
 *   - Assistant image / non-image file: not verified — omit
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

/** @type {string} */
const MESSAGE_USER_IMAGE_SELECTOR = "img.preview-image";

/** @type {string} */
const MESSAGE_IMAGE_PLACEHOLDER = "[Image]";

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
 * @param {Element} root
 * @param {string} selector
 * @returns {Element[]}
 */
function queryAllInElement(root, selector) {
  /** @type {Element[]} */
  const matches = [...root.querySelectorAll(selector)];
  if (root.shadowRoot) {
    matches.push(...root.shadowRoot.querySelectorAll(selector));
  }
  return matches;
}

/**
 * Verified placeholders only (Step8). Display order: text then images.
 * @param {Element} turn
 * @returns {string[]}
 */
function placeholdersFromTurnElement(turn) {
  if (turn.tagName.toLowerCase() !== "user-query") {
    return [];
  }
  const count = queryAllInElement(turn, MESSAGE_USER_IMAGE_SELECTOR).length;
  /** @type {string[]} */
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(MESSAGE_IMAGE_PLACEHOLDER);
  }
  return out;
}

/**
 * @param {Element} turn
 * @returns {string}
 */
function textFromTurnElement(turn) {
  const tag = turn.tagName.toLowerCase();
  /** @type {string} */
  let text = "";
  if (tag === "user-query") {
    text = queryInElement(turn, MESSAGE_USER_TEXT_SELECTOR)?.innerText?.trim() ?? "";
  } else if (tag === "model-response") {
    text =
      queryInElement(turn, MESSAGE_ASSISTANT_TEXT_SELECTOR)?.innerText?.trim() ?? "";
  }

  const placeholders = placeholdersFromTurnElement(turn);
  if (placeholders.length === 0) {
    return text;
  }
  if (text) {
    return `${text}\n\n${placeholders.join("\n\n")}`;
  }
  return placeholders.join("\n\n");
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
