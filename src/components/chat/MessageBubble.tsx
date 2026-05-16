import { CheckCircle, XCircle, Phone, Info, Stethoscope } from "lucide-react";
import { SYSTEM_MESSAGE_BACKGROUNDS } from "@/constants";
import type { ChatMessage } from "@/types";
import { ResultPanel } from "@/components/chat/ResultPanel";

interface MessageBubbleProps {
  message: ChatMessage;
}

type ReactNode = React.ReactNode;

function renderMarkdown(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let key = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const raw = match[0];
    if (raw.startsWith("**")) parts.push(<strong key={key++} style={{ fontWeight: 700 }}>{raw.slice(2, -2)}</strong>);
    else if (raw.startsWith("*")) parts.push(<em key={key++}>{raw.slice(1, -1)}</em>);
    else parts.push(<code key={key++} style={{ background: "rgba(16,185,129,0.1)", color: "#059669", padding: "1px 5px", borderRadius: "4px", fontSize: "0.9em", fontFamily: "monospace" }}>{raw.slice(1, -1)}</code>);
    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}

const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  phone: <Phone size={14} strokeWidth={2} />,
  check: <CheckCircle size={14} strokeWidth={2} />,
  error: <XCircle size={14} strokeWidth={2} />,
  info: <Info size={14} strokeWidth={2} />,
};

function SystemMessage({ message }: { message: ChatMessage }) {
  const background = SYSTEM_MESSAGE_BACKGROUNDS[message.systemType ?? "info"];
  const icon = SYSTEM_ICONS[message.systemIcon ?? "info"];
  return (
    <div className="flex justify-center my-2 lu-system-msg">
      <div style={{ background, color: "#FFFFFF", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, maxWidth: "85%", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: "6px" }}>
        {icon}
        {message.content}
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end mb-3">
      <div style={{ background: "linear-gradient(135deg, #1A1A1A, #2D2D2D)", color: "#FFFFFF", padding: "10px 16px", borderRadius: "18px 18px 6px 18px", maxWidth: "80%", fontSize: "14px", lineHeight: "1.5", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        {content}
      </div>
    </div>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex items-end gap-2.5">
        <div className="flex-shrink-0" style={{ width: "32px", height: "32px", borderRadius: "12px", background: "linear-gradient(135deg, #059669, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(5,150,105,0.3)" }}>
          <Stethoscope size={16} color="#FFFFFF" strokeWidth={2} />
        </div>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", padding: "10px 16px", borderRadius: "18px 18px 18px 6px", maxWidth: "80%", fontSize: "14px", lineHeight: "1.6", color: "#1F2937", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {message.content.split("\n").map((line, i) => (
            <span key={i}>{i > 0 && <br />}{renderMarkdown(line)}</span>
          ))}
        </div>
      </div>
      {message.copayResults && (
        <div className="ml-[42px]">
          <ResultPanel policy={message.copayResults.policy} hospitals={message.copayResults.hospitals} />
        </div>
      )}
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "system") return <SystemMessage message={message} />;
  if (message.role === "user") return <UserMessage content={message.content} />;
  return <AssistantMessage message={message} />;
}
