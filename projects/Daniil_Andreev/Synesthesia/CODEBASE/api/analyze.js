const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODELS = (process.env.OPENROUTER_MODELS || 'openai/gpt-oss-120b:free,z-ai/glm-4.5-air:free,nvidia/nemotron-3-super-120b-a12b:free').split(',');

async function fetchLyrics(artist, title) {
    try {
        const r = await fetch(
            `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
            { signal: AbortSignal.timeout(5000) }
        );
        if (!r.ok) return '';
        const { lyrics } = await r.json();
        return (lyrics || '').slice(0, 2000);
    } catch { return ''; }
}

async function callModel(model, messages, timeoutMs) {
    const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://synesthesia-gules.vercel.app',
            'X-Title': 'Synesthesia'
        },
        body: JSON.stringify({
            model,
            response_format: { type: 'json_object' },
            max_tokens: 800,
            messages
        })
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(`${res.status}: ${text.slice(0, 200)}`);
        err.status = res.status;
        throw err;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    if (!content) throw new Error(`Empty response`);

    try { return JSON.parse(content); }
    catch {
        const m = content.match(/\{[\s\S]*\}/);
        if (m) return JSON.parse(m[0]);
        throw new Error(`Bad JSON: ${content.slice(0, 200)}`);
    }
}

async function analyze(artist, title, lyrics) {
    const lyricsBlock = lyrics
        ? `Текст песни:\n${lyrics}`
        : '(текст не найден — анализируй по названию и артисту)';

    const messages = [{
        role: 'system',
        content: 'Ты — синестет. Возвращай ТОЛЬКО валидный JSON. Все значения на русском, образно и кратко.'
    }, {
        role: 'user',
        content: `Песня "${title}" — ${artist}.
${lyricsBlock}

JSON: {"colors":[{"name":"","hex":"#RRGGBB","reason":""}],"taste":{"main":"","description":"","notes":[]},"aroma":{"top":[],"middle":[],"base":[]},"explanation":""}

3 цвета, вкус (блюдо/напиток + 2 предложения + 3 ноты), аромат (1-2 ноты на каждый уровень), 2 предложения объяснения. Кратко и поэтично.`
    }];

    const errors = [];
    const perModelTimeout = Math.max(15000, Math.floor(50000 / MODELS.length));

    for (const model of MODELS) {
        try {
            const result = await callModel(model.trim(), messages, perModelTimeout);
            if (result.colors && result.taste && result.aroma) return result;
            errors.push(`${model}: invalid shape`);
        } catch (err) {
            errors.push(`${model}: ${err.message.slice(0, 100)}`);
            if (err.status === 401) break;
        }
    }
    throw new Error(`Все модели недоступны. ${errors.join(' | ')}`);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { artist, title } = req.body || {};
    if (!artist || !title) return res.status(400).json({ error: 'artist and title required' });

    try {
        const lyrics = await fetchLyrics(artist, title);
        const result = await analyze(artist, title, lyrics);
        res.json(result);
    } catch (err) {
        console.error('analyze error:', err.message);
        const isTimeout = err.name === 'TimeoutError' || /timeout/i.test(err.message);
        res.status(isTimeout ? 504 : 500).json({
            error: isTimeout
                ? 'Не удалось почувствовать эту песню — модель слишком долго думала. Попробуйте ещё раз или другую песню.'
                : `Что-то пошло не так: ${err.message}`
        });
    }
}
