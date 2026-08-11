/**
 * Service Worker (skeleton).
 * Download implementation is Step7 — not here.
 */
importScripts("messages.js");

chrome.runtime.onInstalled.addListener(() => {
  console.log("[gemini-live-export] service worker installed");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== "string") {
    return;
  }

  if (message.type === Messages.PING) {
    sendResponse({ type: Messages.PONG, ok: true });
    return true;
  }

  return;
});
