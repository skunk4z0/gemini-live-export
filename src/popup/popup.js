/**
 * Popup UI.
 * Enables Save on a Gemini chat when conversation, messages, and Markdown are ready.
 * Save downloads Markdown via the service worker (Step7).
 */

const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("save-btn");

/**
 * @param {string} text
 */
function setStatus(text) {
  statusEl.textContent = text;
}

/**
 * @param {boolean} enabled
 */
function setSaveEnabled(enabled) {
  saveBtn.disabled = !enabled;
}

/**
 * @returns {Promise<chrome.tabs.Tab | undefined>}
 */
async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

/**
 * @param {number} tabId
 * @param {string} type
 */
function sendContentMessage(tabId, type) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { type }, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(response ?? null);
    });
  });
}

/**
 * @param {{ type: string, content: string, title?: string }} payload
 * @returns {Promise<{ ok: boolean, filename?: string, downloadId?: number, error?: string } | null>}
 */
function sendBackgroundMessage(payload) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(response ?? null);
    });
  });
}

/**
 * Ask the content script; success means we are on a Gemini chat page.
 * @param {number} tabId
 */
function pingContentScript(tabId) {
  return sendContentMessage(tabId, Messages.IS_GEMINI_PAGE).then((response) =>
    response && response.ok ? response : null
  );
}

/**
 * @param {number} tabId
 */
function fetchConversation(tabId) {
  return sendContentMessage(tabId, Messages.GET_CONVERSATION).then((response) =>
    response && response.ok && response.conversation ? response.conversation : null
  );
}

/**
 * @param {number} tabId
 * @returns {Promise<{ messages: object[] } | { error: string }>}
 */
function fetchMessages(tabId) {
  return sendContentMessage(tabId, Messages.GET_MESSAGES).then((response) => {
    if (!response) {
      // Usually: extension reloaded but this tab still has the old content script.
      return { error: "no_response" };
    }
    if (response.error) {
      return { error: String(response.error) };
    }
    if (!Array.isArray(response.messages)) {
      return { error: "invalid_response" };
    }
    return { messages: response.messages };
  });
}

/**
 * @param {number} tabId
 * @returns {Promise<{ markdown: string, conversation?: object | null } | { error: string }>}
 */
function fetchMarkdown(tabId) {
  return sendContentMessage(tabId, Messages.GET_MARKDOWN).then((response) => {
    if (!response) {
      return { error: "no_response" };
    }
    if (response.error) {
      return { error: String(response.error) };
    }
    if (typeof response.markdown !== "string") {
      return { error: "invalid_response" };
    }
    return {
      markdown: response.markdown,
      conversation: response.conversation ?? null,
    };
  });
}

async function refreshPageState() {
  setSaveEnabled(false);
  setStatus("Checking page…");

  const tab = await getActiveTab();
  if (!tab || tab.id == null) {
    setStatus("No active tab.");
    return;
  }

  if (!GeminiDetect.isGeminiChatUrl(tab.url)) {
    setStatus("Open a Gemini chat to export.");
    return;
  }

  const response = await pingContentScript(tab.id);
  if (!response) {
    setStatus("Gemini chat detected, but content script is not ready. Reload the tab.");
    return;
  }

  const conversation = await fetchConversation(tab.id);
  if (!conversation) {
    setStatus("Gemini chat detected, but conversation is not loaded yet.");
    return;
  }

  const messagesResult = await fetchMessages(tab.id);
  if ("error" in messagesResult) {
    if (messagesResult.error === "no_response") {
      setStatus("Messages API missing. Reload the Gemini tab after updating the extension.");
      return;
    }
    setStatus(`Message extract failed: ${messagesResult.error}`);
    return;
  }

  const messages = messagesResult.messages;
  if (messages.length === 0) {
    setStatus("Gemini chat detected, but messages are not loaded yet.");
    return;
  }

  const markdownResult = await fetchMarkdown(tab.id);
  if ("error" in markdownResult) {
    if (markdownResult.error === "no_response") {
      setStatus("Markdown API missing. Reload the Gemini tab after updating the extension.");
      return;
    }
    setStatus(`Markdown generation failed: ${markdownResult.error}`);
    return;
  }

  const markdown = markdownResult.markdown;
  if (!markdown.trim()) {
    setStatus("Gemini chat detected, but Markdown is empty.");
    return;
  }

  const label = conversation.title || conversation.id || "chat";
  const kb = (markdown.length / 1024).toFixed(1);
  setStatus(`Ready: ${label} (${messages.length} messages, ${kb} KB Markdown)`);
  setSaveEnabled(true);
}

saveBtn.addEventListener("click", async () => {
  setSaveEnabled(false);
  setStatus("Preparing download…");

  const tab = await getActiveTab();
  if (!tab || tab.id == null) {
    setStatus("No active tab.");
    return;
  }

  const markdownResult = await fetchMarkdown(tab.id);
  if ("error" in markdownResult) {
    setStatus(`Markdown generation failed: ${markdownResult.error}`);
    setSaveEnabled(true);
    return;
  }

  const markdown = markdownResult.markdown;
  if (!markdown.trim()) {
    setStatus("Markdown is empty.");
    setSaveEnabled(true);
    return;
  }

  const conversation = markdownResult.conversation;
  const title =
    conversation && typeof conversation.title === "string"
      ? conversation.title
      : undefined;

  setStatus("Opening save dialog…");
  const downloadResult = await sendBackgroundMessage({
    type: Messages.DOWNLOAD_FILE,
    content: markdown,
    title,
  });

  if (!downloadResult) {
    setStatus("Download failed: no response from background.");
    setSaveEnabled(true);
    return;
  }

  if (!downloadResult.ok) {
    setStatus(`Download failed: ${downloadResult.error || "unknown error"}`);
    setSaveEnabled(true);
    return;
  }

  const name = downloadResult.filename || "file";
  setStatus(`Saved: ${name}`);
  setSaveEnabled(true);
});

refreshPageState().catch((err) => {
  console.error("[gemini-live-export] popup init failed", err);
  setStatus("Failed to check page.");
  setSaveEnabled(false);
});
