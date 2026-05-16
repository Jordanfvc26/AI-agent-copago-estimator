import { CHAT_API_ENDPOINT, FALLBACK_ERROR_MESSAGE } from "@/constants";
import type { ApiMessage, CopayResult } from "@/types";

interface ChatResponse {
  content: string;
  copayResults?: CopayResult;
  handoff?: boolean;
}

export async function sendChatMessage(history: ApiMessage[]): Promise<ChatResponse> {
  const response = await fetch(CHAT_API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history }),
  });

  const data = await response.json();

  return {
    content: data.content || FALLBACK_ERROR_MESSAGE,
    copayResults: data.copayResults,
    handoff: data.handoff,
  };
}
