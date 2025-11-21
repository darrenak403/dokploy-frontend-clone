"use client";
import React, { useEffect, useRef } from "react";

import { Icon } from "@iconify/react";

import { findSampleAnswer } from "./companyInfo";

interface ChatMessage {
  hideInChat?: boolean;
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

interface ChatFormProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  generateBotResponse: (history: ChatMessage[]) => Promise<void>;
  onStartChat?: () => void;
}

const ChatForm: React.FC<ChatFormProps> = ({
  chatHistory,
  setChatHistory,
  generateBotResponse,
  onStartChat,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const adjust = () => {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
    };
    adjust();
    el.addEventListener("input", adjust);
    return () => el.removeEventListener("input", adjust);
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputRef.current) return;

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    // Hide initial options when user starts chatting
    if (onStartChat) onStartChat();

    // append user message
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user", text: userMessage },
    ];
    setChatHistory(newHistory);

    // show thinking immediately
    setChatHistory((h) => [...h, { role: "model", text: "Đang suy nghĩ..." }]);
    const lastBotMessage =
      chatHistory
        .slice()
        .reverse()
        .find(
          (m) =>
            m.role === "model" &&
            m.text &&
            m.text.trim() !== "Đang suy nghĩ..." &&
            /\?\s*$/.test(m.text.trim())
        )?.text ?? undefined;

    const sample = findSampleAnswer(userMessage, lastBotMessage);
    console.log(
      "🔍 findSampleAnswer result:",
      sample,
      "lastBotQuestion:",
      lastBotMessage
    );

    if (sample) {
      // replace Thinking... with matched reply after short delay (simulate thinking)
      setTimeout(() => {
        const reply = sample.trim();
        setChatHistory((history) => [
          ...history.filter((msg) => msg.text !== "Đang suy nghĩ..."),
          { role: "model", text: reply },
        ]);
      }, 600);
      return;
    }

    // fallback: call API after short delay
    setTimeout(() => {
      generateBotResponse(newHistory);
    }, 600);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <textarea
        placeholder="Bạn cần hổ trợ gì...."
        className="messages-input"
        required
        ref={inputRef}
        rows={1}
        onInput={() => {
          const el = inputRef.current;
          if (!el) return;
          el.style.height = "auto";
          el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
        }}
      />

      <button type="submit">
        <Icon
          icon="stash:arrow-up-solid"
          className="iconify absolute top-0 left-0 transform translate-x-1/3 translate-y-1/3"
        />
      </button>
    </form>
  );
};

export default ChatForm;
