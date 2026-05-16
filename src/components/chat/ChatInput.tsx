interface ChatInputProps {
  value: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
}

function SendButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      onClick={undefined}
      disabled={disabled}
      type="submit"
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        background: disabled ? "#E5E7EB" : "linear-gradient(135deg, #059669, #10B981)",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.2s, transform 0.15s",
        boxShadow: disabled ? "none" : "0 2px 8px rgba(5,150,105,0.3)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={disabled ? "#9CA3AF" : "#FFFFFF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </button>
  );
}

export function ChatInput({ value, isLoading, inputRef, onChange, onKeyDown, onSend }: ChatInputProps) {
  const isDisabled = isLoading || !value.trim();

  return (
    <div style={{ borderTop: "1px solid #E5E7EB", background: "#FFFFFF", padding: "12px 16px", flexShrink: 0 }}>
      <div
        className="flex items-end gap-2"
        style={{ background: "#F9FAFB", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "4px 4px 4px 14px", transition: "border-color 0.2s, box-shadow 0.2s" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <textarea
          ref={inputRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Describe tus síntomas o ingresa tu número de póliza..."
          disabled={isLoading}
          rows={1}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", resize: "none", fontSize: "14px", color: "#1F2937", lineHeight: "1.5", padding: "8px 0", fontFamily: "Inter, sans-serif", maxHeight: "120px" }}
        />
        <div onClick={!isDisabled ? onSend : undefined}>
          <SendButton disabled={isDisabled} />
        </div>
      </div>
      <p style={{ fontSize: "10px", color: "#9CA3AF", textAlign: "center", marginTop: "6px" }}>
        Estimación con IA · No sustituye el consejo médico profesional
      </p>
    </div>
  );
}
