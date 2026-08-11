/**
 * Popup UI (skeleton).
 * Enables Save only when the active tab is a Gemini page (content script responds).
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
 * True when URL is under gemini.google.com (hostname check only).
 * @param {string | undefined} url
 */
function isGeminiUrl(url) {
  if (!url) {
    return false;
  }
  try {
    const { hostname } = new URL(url);
    return hostname === "gemini.google.com";
  } catch {
    return false;
  }
}

/**
 * Ask the content script; success means we are on an injected Gemini page.
 * @param {number} tabId
 */
function pingContentScript(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: Messages.IS_GEMINI_PAGE },
      (response) => {
        if (chrome.runtime.lastError) {
          resolve(null);
          return;
        }
        resolve(response && response.ok ? response : null);
      }
    );
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

  if (!isGeminiUrl(tab.url)) {
    setStatus("Open a Gemini page to export.");
    return;
  }

  const response = await pingContentScript(tab.id);
  if (!response) {
    setStatus("Gemini page detected, but content script is not ready. Reload the tab.");
    return;
  }

  setStatus("Gemini page ready.");
  // Enabled only to show page detection; click is a no-op until later steps.
  setSaveEnabled(true);
}

saveBtn.addEventListener("click", () => {
  // Step1: export pipeline not implemented yet.
  setStatus("Save is not implemented yet (Step1 skeleton).");
});

refreshPageState().catch((err) => {
  console.error("[gemini-live-export] popup init failed", err);
  setStatus("Failed to check page.");
  setSaveEnabled(false);
});
