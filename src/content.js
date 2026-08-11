/**
 * Content script entry.
 * DOM extraction is out of scope until Step3.
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== "string") {
    return;
  }

  if (message.type === Messages.PING || message.type === Messages.IS_GEMINI_PAGE) {
    const href = location.href;
    const isChatPage = GeminiDetect.isGeminiChatUrl(href);
    sendResponse({
      type: Messages.PONG,
      ok: isChatPage,
      href,
      chatId: isChatPage ? GeminiDetect.extractGeminiChatId(href) : null,
    });
    return true;
  }

  return;
});
