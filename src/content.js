/**
 * Content script entry.
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

  if (message.type === Messages.GET_CONVERSATION) {
    const href = location.href;
    const conversation = GeminiExtractConversation.extractConversation(href);
    sendResponse({
      type: Messages.PONG,
      ok: conversation != null,
      href,
      conversation,
    });
    return true;
  }

  return;
});
