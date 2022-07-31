import { createContext } from "react";

export const ConversationContext = createContext({
    conversationId: null,
    party2Id: null,
    name: null,
    chatId: null,
    setConversation: () => {},
});
