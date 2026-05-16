import { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "@/services/chatService";
import { INIT_MESSAGE } from "@/constants";
import type { ChatMessage, ApiMessage, CopayResult } from "@/types";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  showHandoff: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  sendMessage: (text: string) => Promise<void>;
  dismissHandoff: () => void;
  connectHandoff: () => void;
}

function buildSuccessMessage(copayResults: CopayResult): ChatMessage {
  return {
    role: "system",
    content: `¡Encontramos ${copayResults.hospitals.length} opciones de hospitales para tu plan ${copayResults.policy.plan}!`,
    systemType: "success",
    systemIcon: "check",
  };
}

function buildErrorMessage(): ChatMessage {
  return {
    role: "system",
    content: "Error de conexión. Por favor intenta de nuevo.",
    systemType: "error",
    systemIcon: "error",
  };
}

function buildHandoffMessage(): ChatMessage {
  return {
    role: "system",
    content: "Conectándote con un especialista de soporte médico...",
    systemType: "info",
    systemIcon: "phone",
  };
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [apiHistory, setApiHistory] = useState<ApiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, isLoading, showHandoff]);

  async function initializeChat() {
    setIsLoading(true);
    const seed: ApiMessage[] = [{ role: "user", content: INIT_MESSAGE }];
    const response = await sendChatMessage(seed);
    setApiHistory(seed);
    setMessages([{ role: "assistant", content: response.content }]);
    setIsLoading(false);
    inputRef.current?.focus();
  }

  async function sendMessage(text: string) {
    const updatedHistory: ApiMessage[] = [...apiHistory, { role: "user", content: text }];
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoading(true);
    setShowHandoff(false);

    try {
      const response = await sendChatMessage(updatedHistory);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.content,
        ...(response.copayResults ? { copayResults: response.copayResults } : {}),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setApiHistory([...updatedHistory, { role: "assistant", content: response.content }]);

      if (response.copayResults) {
        setMessages((prev) => [...prev, buildSuccessMessage(response.copayResults!)]);
      }
      if (response.handoff) setShowHandoff(true);
    } catch {
      setMessages((prev) => [...prev, buildErrorMessage()]);
    } finally {
      setIsLoading(false);
    }
  }

  function connectHandoff() {
    setShowHandoff(false);
    setMessages((prev) => [...prev, buildHandoffMessage()]);
  }

  function dismissHandoff() {
    setShowHandoff(false);
  }

  return {
    messages,
    isLoading,
    showHandoff,
    messagesContainerRef,
    inputRef,
    sendMessage,
    dismissHandoff,
    connectHandoff,
  };
}
