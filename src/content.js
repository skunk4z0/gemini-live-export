/**
 * Content script entry (skeleton).
 * DOM extraction is out of scope for Step1.
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== "string") {
    return;
  }

  if (message.type === Messages.PING || message.type === Messages.IS_GEMINI_PAGE) {
    sendResponse({
      type: Messages.PONG,
      ok: true,
      href: location.href,
    });
    return true;
  }

  return;
});
