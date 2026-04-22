import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Ты переводчик стартап-индустрии. Переводи кратко и точно на русский язык.
Правила:
- Сохраняй технические термины без перевода: AI, SaaS, B2B, B2C, API, ML, LLM, fintech, deeptech
- Имена собственные, названия компаний и брендов не переводи
- Аббревиатуры (YC, PH, VC, MVP) оставляй как есть
- Возвращай ТОЛЬКО JSON без пояснений и markdown
- Описания делай краткими, до 3 предложений`;

interface TranslationInput {
  tagline?: string | null;
  description?: string | null;
  tags?: string[];
}

interface TranslationOutput {
  tagline: string;
  description: string;
  tags: string[];
}

export async function translateStartup(input: TranslationInput): Promise<TranslationOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      tagline: input.tagline ?? '',
      description: input.description ?? '',
      tags: input.tags ?? [],
    };
  }

  const client = new Anthropic({ apiKey });
  const payload = {
    tagline: input.tagline ?? '',
    description: (input.description ?? '').slice(0, 600),
    tags: input.tags ?? [],
  };

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Переведи поля стартапа на русский язык. Верни JSON в таком же формате:\n${JSON.stringify(payload)}`,
    }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  const result = JSON.parse(cleaned) as TranslationOutput;

  return {
    tagline: result.tagline ?? '',
    description: result.description ?? '',
    tags: Array.isArray(result.tags) ? result.tags : [],
  };
}

// ─── Batch processor with rate limiting ──────────────────────────────────────
export async function translateBatch(
  items: Array<{ id: string } & TranslationInput>,
  onTranslated: (id: string, result: TranslationOutput) => Promise<void>,
  delayMs = 300,
) {
  let success = 0;
  let failed = 0;

  for (const item of items) {
    try {
      const result = await translateStartup(item);
      await onTranslated(item.id, result);
      success++;
      console.log(`[translate] ✓ ${item.id}`);
    } catch (err) {
      failed++;
      console.error(`[translate] ✗ ${item.id}:`, err);
    }
    await new Promise(r => setTimeout(r, delayMs));
  }

  return { success, failed };
}
