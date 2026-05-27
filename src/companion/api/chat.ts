import type { CompanionMemoryPayload } from '../storage/types';

export type ChatApiRole = 'user' | 'assistant';

export type ChatApiMessage = {
  role: ChatApiRole;
  content: string;
};

export class CompanionChatError extends Error {
  readonly code: string;

  constructor(message: string, code = 'UNKNOWN') {
    super(message);
    this.name = 'CompanionChatError';
    this.code = code;
  }
}

type ChatSuccess = { reply: string };
type ChatFailure = { error?: string; code?: string };

export async function sendCompanionChat(
  messages: ChatApiMessage[],
  memory?: CompanionMemoryPayload
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, memory: memory ?? {} }),
  });

  let data: ChatSuccess & ChatFailure;
  try {
    data = (await res.json()) as ChatSuccess & ChatFailure;
  } catch {
    throw new CompanionChatError('無法解析伺服器回應', 'PARSE');
  }

  if (!res.ok) {
    const code = data.code ?? 'HTTP';
    const msg =
      code === 'NO_API_KEY'
        ? '伺服器尚未設定 OpenAI API Key'
        : data.error || `請求失敗（${res.status}）`;
    throw new CompanionChatError(msg, code);
  }

  if (typeof data.reply !== 'string' || !data.reply.trim()) {
    throw new CompanionChatError('AI 沒有回傳內容', 'EMPTY_REPLY');
  }

  return data.reply.trim();
}

/** 轉成 API 格式，保留最近 10 則 */
export function toApiMessages(
  messages: { from: 'user' | 'companion'; text: string }[]
): ChatApiMessage[] {
  return messages
    .filter((m) => m.text.trim())
    .slice(-10)
    .map((m) => ({
      role: m.from === 'user' ? 'user' : 'assistant',
      content: m.text.trim(),
    }));
}
