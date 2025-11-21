"use client";
import React, { useEffect, useRef, useState } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";

import "./Chatbox.moduel.css";
import ChatForm from "./components/ChatForm";
import ChatMessageComponent from "./components/ChatMessage";
import ChatbotIcon from "./components/ChatbotIcon";
import InitialOptions from "./components/InitialOptions";
import { companyInfo } from "./components/companyInfo";

// TypeScript interfaces
interface ChatMessage {
  hideInChat?: boolean;
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

const Chatbox: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { hideInChat: true, role: "model", text: companyInfo },
  ]);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [showInitialOptions, setShowInitialOptions] = useState<boolean>(true);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleOptionSelect = (prompt: string) => {
    setShowInitialOptions(false);
    // Add user message
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user", text: prompt },
    ];
    setChatHistory(newHistory);
    // Show thinking
    setChatHistory((h) => [...h, { role: "model", text: "Đang suy nghĩ..." }]);
    // Generate response after short delay
    setTimeout(() => {
      generateBotResponse(newHistory);
    }, 600);
  };

  const handleShowDevelopmentMessage = () => {
    // Add development message to chat
    setChatHistory((h) => [
      ...h,
      {
        role: "model",
        text: "⚠️ Tính năng này hiện đang trong quá trình phát triển. Vui lòng chọn tính năng khác hoặc gõ câu hỏi của bạn bên dưới.",
      },
    ]);
    // Keep showing initial options
    setShowInitialOptions(true);
  };

  const generateBotResponse = async (history: ChatMessage[]) => {
    // helper function to update chat history
    const updateHistory = (text: string, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError } as ChatMessage,
      ]);
    };

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_GEMINI_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message || "Failed to fetch response");

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      updateHistory(errorMessage, true);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className={`containerChatbot ${showChatbot ? "show-chatbot" : ""}`}>
      <button
        id="chatbot-toggler"
        onClick={() => setShowChatbot((prev) => !prev)}
      >
        {!showChatbot ? (
          <Icon icon="material-symbols:chat-outline" />
        ) : (
          <Icon icon="mdi:close" />
        )}
      </button>

      <div className="chatbot-popup">
        {/* Chatbox header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Ask Dr.Meddy</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)}>
            <Icon icon="ep:arrow-down-bold" className="iconify" />
          </button>
        </div>
        {/* Chatbox body */}
        <div ref={chatBodyRef} className="chat-body">
          {/* Render chat history */}
          {chatHistory.map((chat, index) => (
            <ChatMessageComponent key={index} chat={chat} />
          ))}
          {/* Show initial options if no user messages yet OR after development message */}
          {showInitialOptions &&
            chatHistory.filter((m) => m.role === "user").length === 0 && (
              <InitialOptions
                onSelectOption={handleOptionSelect}
                onShowDevelopmentMessage={handleShowDevelopmentMessage}
              />
            )}
        </div>
        {/* Chatbox footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
            onStartChat={() => setShowInitialOptions(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
