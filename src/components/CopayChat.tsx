"use client";
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";

export default function CopayChat() {
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, showHandoff, messagesContainerRef, inputRef, sendMessage, dismissHandoff, connectHandoff } = useChat();

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    await sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: "#FFFFFF" }}>
      <ChatHeader />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        showHandoff={showHandoff}
        containerRef={messagesContainerRef}
        onConnect={connectHandoff}
        onDismiss={dismissHandoff}
      />
      <ChatInput
        value={inputValue}
        isLoading={isLoading}
        inputRef={inputRef}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
      />
    </div>
  );
}
