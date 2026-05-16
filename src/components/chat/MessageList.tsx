import { Stethoscope } from "lucide-react";
import type { ChatMessage } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { HandoffPrompt } from "./HandoffPrompt";
import TypingIndicator from "@/components/TypingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  showHandoff: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onConnect: () => void;
  onDismiss: () => void;
}

function LoadingPlaceholder() {
  return (
    <div className="text-center py-8 animate-fade-up">
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #059669, #10B981)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px auto",
          boxShadow: "0 4px 16px rgba(5,150,105,0.3)",
        }}
      >
        <Stethoscope size={28} color="#FFFFFF" strokeWidth={1.8} />
      </div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1F2937", fontFamily: "'DM Sans', Inter, sans-serif", margin: 0 }}>
        Estimador de Copago
      </h2>
      <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
        Calculando tus costos médicos con IA
      </p>
    </div>
  );
}

function AssistantTypingBubble() {
  return (
    <div className="flex items-end gap-2.5 animate-fade-up">
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #059669, #10B981)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 6px rgba(5,150,105,0.3)",
        }}
      >
        <Stethoscope size={16} color="#FFFFFF" strokeWidth={2} />
      </div>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "18px 18px 18px 6px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <TypingIndicator />
      </div>
    </div>
  );
}

export function MessageList({ messages, isLoading, showHandoff, containerRef, onConnect, onDismiss }: MessageListProps) {
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-5"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)" }}
    >
      {messages.length === 0 && isLoading && <LoadingPlaceholder />}
      {messages.map((message, index) => (
        <div key={index} className="animate-fade-up">
          <MessageBubble message={message} />
        </div>
      ))}
      {isLoading && messages.length > 0 && <AssistantTypingBubble />}
      {showHandoff && <HandoffPrompt onConnect={onConnect} onDismiss={onDismiss} />}
    </div>
  );
}
