"use client";
import React from "react";

import ChatbotIcon from "./ChatbotIcon";

interface ChatMessage {
  hideInChat?: boolean;
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

interface ChatMessageProps {
  chat: ChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ chat }) => {
  return (
    !chat.hideInChat && (
      <div
        className={`messages ${
          chat.role === "model" ? "bot" : "user"
        }-messages ${chat.isError ? "error" : ""}`}
      >
        {chat.role === "model" && <ChatbotIcon />}
        <p
          className="messages-text"
          dangerouslySetInnerHTML={{ __html: chat.text }}
        />
      </div>
    )
  );
};

export default ChatMessage;
