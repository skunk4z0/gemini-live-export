/**
 * Popup UI.
 * Enables Save only on a Gemini chat URL when the content script responds.
 * Save action itself is deferred to later steps.
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

  const label = conversation.title || conversation.id || "chat";
  setStatus(`Ready: ${label}`);
  // Enabled only to show detection + metadata; click is a no-op until later steps.
  setSaveEnabled(true);
}

saveBtn.addEventListener("click", () => {
  // Export pipeline (Markdown / download) is Step6+.
  setStatus("Save is not implemented yet (Step6+).");
});

refreshPageState().catch((err) => {
  console.error("[gemini-live-export] popup init failed", err);
  setStatus("Failed to check page.");
  setSaveEnabled(false);
});
