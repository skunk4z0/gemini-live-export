/**
 * Markdown generation (string only).
 *
 * Step6: builds Obsidian-compatible Markdown from Conversation + Message[].
 * No DOM access, no download. Input text comes from extract-messages + filter-messages.
 *
 * Output spec: DESIGN.md (Frontmatter + ## 👤 User / ## 🤖 Gemini headings).
 */

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
 * @typedef {Object} Message
 * @property {"user" | "assistant"} role
 * @property {string} text
 * @property {string} [messageId]
 * @property {number} [createTime]
 */

/** @type {Readonly<Record<"user" | "assistant", string>>} */
const ROLE_HEADINGS = Object.freeze({
  user: "## 👤 User",
  assistant: "## 🤖 Gemini",
});

/**
 * @param {number} ms
 * @returns {string}
 */
function formatDateTime(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * @param {Conversation | null | undefined} conversation
 * @returns {string}
 */
function resolveTitle(conversation) {
  const title = conversation?.title?.trim();
  if (title) {
    return title;
  }
  const id = conversation?.id?.trim() || conversation?.conversation_id?.trim();
  if (id) {
    return id;
  }
  return "Untitled";
}

/**
 * @param {Conversation | null | undefined} conversation
 * @param {Message[]} messages
 * @returns {{ created: number, updated: number }}
 */
function resolveTimestamps(conversation, messages) {
  /** @type {number[]} */
  const messageTimes = [];
  for (const message of messages) {
    if (typeof message.createTime === "number" && Number.isFinite(message.createTime)) {
      messageTimes.push(message.createTime);
    }
  }

  const firstMessageTime = messageTimes.length > 0 ? Math.min(...messageTimes) : undefined;
  const lastMessageTime = messageTimes.length > 0 ? Math.max(...messageTimes) : undefined;

  const convCreated =
    typeof conversation?.create_time === "number" && Number.isFinite(conversation.create_time)
      ? conversation.create_time
      : undefined;
  const convUpdated =
    typeof conversation?.update_time === "number" && Number.isFinite(conversation.update_time)
      ? conversation.update_time
      : undefined;

  const now = Date.now();
  const created = convCreated ?? firstMessageTime ?? now;
  const updated = convUpdated ?? lastMessageTime ?? created;

  return { created, updated };
}

/**
 * @param {string} text
 * @returns {string}
 */
function normalizeBodyText(text) {
  return text.trim().replace(/\n{3,}/g, "\n\n");
}

/**
 * Frontmatter per Obsidian_Vault rules (2026-08-22/24):
 * `type: log` + created / updated / source / tags only.
 *
 * @param {Conversation | null | undefined} conversation
 * @param {Message[]} messages
 * @returns {string}
 */
function buildFrontmatter(conversation, messages) {
  const { created, updated } = resolveTimestamps(conversation, messages);

  const lines = [
    "---",
    "type: log",
    `created: "${formatDateTime(created)}"`,
    `updated: "${formatDateTime(updated)}"`,
    "source: Gemini",
    "tags:",
    "  - gemini",
    "---",
  ];

  return lines.join("\n");
}

/**
 * @param {string} title
 * @param {Message[]} messages
 * @returns {string}
 */
function buildBody(title, messages) {
  /** @type {string[]} */
  const parts = [`# ${title}`];

  for (const message of messages) {
    const heading = ROLE_HEADINGS[message.role];
    if (!heading) {
      continue;
    }
    parts.push("", heading, "", normalizeBodyText(message.text));
  }

  return parts.join("\n").trimEnd();
}

/**
 * Generate full Markdown document.
 * @param {Conversation | null | undefined} conversation
 * @param {Message[]} messages
 * @returns {string}
 */
function generateMarkdown(conversation, messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "";
  }

  const title = resolveTitle(conversation);
  const frontmatter = buildFrontmatter(conversation, messages);
  const body = buildBody(title, messages);

  return `${frontmatter}\n\n${body}\n`;
}

/** @type {{ generateMarkdown: typeof generateMarkdown }} */
const GeminiMarkdown = Object.freeze({
  generateMarkdown,
});
