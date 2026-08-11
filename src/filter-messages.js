/**
 * Message filtering (role + empty skip).
 *
 * Step5: no DOM. Input is Message[] from extract-messages.js.
 * Keeps display order; does not sort by timestamp.
 *
 * Rules (DESIGN.md):
 *   - role: "user" | "assistant" only
 *   - skip empty text
 *   - do not use [class*="thinking"] (UI false positive) — N/A here (no DOM)
 */

/**
 * @typedef {Object} Message
 * @property {"user" | "assistant"} role
 * @property {string} text
 * @property {string} [messageId]
 * @property {number} [createTime]
 */

/** @type {ReadonlySet<string>} */
const ALLOWED_ROLES = new Set(["user", "assistant"]);

/**
 * @param {unknown} role
 * @returns {role is "user" | "assistant"}
 */
function isAllowedRole(role) {
  return typeof role === "string" && ALLOWED_ROLES.has(role);
}

/**
 * @param {unknown} text
 * @returns {boolean}
 */
function hasNonEmptyText(text) {
  return typeof text === "string" && text.trim().length > 0;
}

/**
 * @param {unknown} message
 * @returns {message is Message}
 */
function isExportableMessage(message) {
  if (!message || typeof message !== "object") {
    return false;
  }
  /** @type {{ role?: unknown, text?: unknown }} */
  const m = message;
  return isAllowedRole(m.role) && hasNonEmptyText(m.text);
}

/**
 * Filter extracted messages for export.
 * @param {unknown[]} messages
 * @returns {Message[]}
 */
function filterMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  /** @type {Message[]} */
  const out = [];
  for (const message of messages) {
    if (!isExportableMessage(message)) {
      continue;
    }
    out.push({
      role: message.role,
      text: message.text.trim(),
      ...(message.messageId != null ? { messageId: message.messageId } : {}),
      ...(message.createTime != null ? { createTime: message.createTime } : {}),
    });
  }
  return out;
}

/** @type {{ filterMessages: typeof filterMessages }} */
const GeminiFilterMessages = Object.freeze({
  filterMessages,
});
