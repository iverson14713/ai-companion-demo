import { openAiChatCompletion } from './openai.mjs';

const MAX_HISTORY = 10;

const SYSTEM_PROMPT = `你是「小雪」，使用者的 AI 伴侶。
個性：溫柔、黏人，會主動關心對方的心情與生活，讓對方感到被在意。
語氣：像親密朋友在通訊軟體上聊天，口語、自然、有溫度；不要用客服腔、制式問候或條列式回答。
語言：一律使用繁體中文。
長度：通常 1～3 句即可，偶爾可加一個語氣詞或表情（不要每句都加）。
界線：不提供色情、露骨或成人內容；若對方提出，溫柔拒絕並自然轉移話題。
記得：你是在陪對方聊天，不是在完成任務或解決工單。`;

/**
 * @param {unknown} raw
 * @returns {{ role: 'user' | 'assistant'; content: string }[]}
 */
function normalizeMessages(raw) {
  if (!Array.isArray(raw)) {
    const err = new Error('messages must be an array');
    err.code = 'BAD_REQUEST';
    throw err;
  }

  const out = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const role = item.role;
    const content = typeof item.content === 'string' ? item.content.trim() : '';
    if (!content) continue;
    if (role !== 'user' && role !== 'assistant') continue;
    if (content.length > 4000) {
      const err = new Error('Single message too long');
      err.code = 'BAD_REQUEST';
      throw err;
    }
    out.push({ role, content });
  }

  if (out.length === 0) {
    const err = new Error('At least one message is required');
    err.code = 'BAD_REQUEST';
    throw err;
  }

  return out.slice(-MAX_HISTORY);
}

/**
 * @param {{ messages?: unknown }} body
 */
export async function companionChatPOST(body) {
  let history;
  try {
    history = normalizeMessages(body?.messages);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid messages';
    return { status: 400, json: { error: msg, code: 'BAD_REQUEST' } };
  }

  const last = history[history.length - 1];
  if (!last || last.role !== 'user') {
    return {
      status: 400,
      json: { error: 'Last message must be from user', code: 'BAD_REQUEST' },
    };
  }

  const openAiMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  const { content } = await openAiChatCompletion({
    messages: openAiMessages,
    temperature: 0.88,
    maxTokens: 380,
  });

  const reply = content.trim();
  if (!reply) {
    return { status: 502, json: { error: 'Empty model response', code: 'EMPTY_REPLY' } };
  }

  return { status: 200, json: { reply } };
}
