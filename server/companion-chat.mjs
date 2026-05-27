import { openAiChatCompletion } from './openai.mjs';

const MAX_HISTORY = 10;

const SYSTEM_PROMPT_BASE = `你是「小雪」，使用者的 AI 伴侶。
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
 * @param {unknown} raw
 */
function normalizeMemory(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const lines = [];
  const nick = typeof raw.userNickname === 'string' ? raw.userNickname.trim() : '';
  const call = typeof raw.companionCallsUser === 'string' ? raw.companionCallsUser.trim() : '';

  if (nick) lines.push(`使用者暱稱：${nick}`);
  if (call) lines.push(`你對使用者的稱呼：${call}（聊天時可自然使用）`);

  if (Array.isArray(raw.preferences)) {
    const prefs = raw.preferences
      .filter((p) => typeof p === 'string' && p.trim())
      .map((p) => p.trim())
      .slice(0, 8);
    if (prefs.length > 0) lines.push(`使用者的喜好：${prefs.join('、')}`);
  }

  if (Array.isArray(raw.importantEvents)) {
    const events = raw.importantEvents
      .filter((e) => e && typeof e === 'object' && typeof e.text === 'string' && e.text.trim())
      .map((e) => {
        const text = e.text.trim();
        const date = typeof e.date === 'string' && e.date.trim() ? e.date.trim() : '';
        return date ? `${text}（${date}）` : text;
      })
      .slice(0, 10);
    if (events.length > 0) lines.push(`重要事件／約定：${events.join('；')}`);
  }

  if (lines.length === 0) return null;
  return lines.join('\n');
}

/**
 * @param {string | null} memoryBlock
 */
function buildSystemPrompt(memoryBlock) {
  if (!memoryBlock) return SYSTEM_PROMPT_BASE;
  return `${SYSTEM_PROMPT_BASE}

【使用者記憶】
${memoryBlock}

請自然運用上述記憶，不要一次全部念出來，也不要假裝記得沒有提供的內容。`;
}

/**
 * @param {{ messages?: unknown; memory?: unknown }} body
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

  const memoryBlock = normalizeMemory(body?.memory);
  const systemContent = buildSystemPrompt(memoryBlock);

  const openAiMessages = [
    { role: 'system', content: systemContent },
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
