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

  if (message.type === Messages.GET_MESSAGES) {
    const href = location.href;
    const onChatPage = GeminiDetect.isGeminiChatUrl(href);
    try {
      const raw = onChatPage ? GeminiExtractMessages.extractMessages() : [];
      const messages = GeminiFilterMessages.filterMessages(raw);
      sendResponse({
        type: Messages.PONG,
        ok: onChatPage,
        href,
        messages,
        count: messages.length,
      });
    } catch (err) {
      sendResponse({
        type: Messages.PONG,
        ok: false,
        href,
        messages: [],
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return true;
  }

  if (message.type === Messages.GET_MARKDOWN) {
    const href = location.href;
    const onChatPage = GeminiDetect.isGeminiChatUrl(href);
    try {
      const conversation = onChatPage
        ? GeminiExtractConversation.extractConversation(href)
        : null;
      const raw = onChatPage ? GeminiExtractMessages.extractMessages() : [];
      const messages = GeminiFilterMessages.filterMessages(raw);
      const markdown =
        conversation && messages.length > 0
          ? GeminiMarkdown.generateMarkdown(conversation, messages)
          : "";
      sendResponse({
        type: Messages.PONG,
        ok: onChatPage && conversation != null && messages.length > 0 && markdown.length > 0,
        href,
        conversation,
        messages,
        markdown,
        count: messages.length,
      });
    } catch (err) {
      sendResponse({
        type: Messages.PONG,
        ok: false,
        href,
        markdown: "",
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return true;
  }

  return;
});
