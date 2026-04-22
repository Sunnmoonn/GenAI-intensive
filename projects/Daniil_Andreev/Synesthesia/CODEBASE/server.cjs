const express = require('express');
const path    = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = process.env.OPENROUTER_MODEL || 'z-ai/glm-4.5-air:free';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchLyrics(artist, title) {
    try {
        const r = await fetch(
            `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
        );
        if (!r.ok) return '';
        const { lyrics } = await r.json();
        return (lyrics || '').slice(0, 3000);
    } catch { return ''; }
}

async function chat(messages, jsonMode = false) {
    const body = { model: MODEL, messages };
    if (jsonMode) body.response_format = { type: 'json_object' };

    const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Synesthesia'
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`OpenRouter error ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
}

async function callOllama(artist, title, lyrics) {
    const lyricsBlock = lyrics
        ? `Song lyrics:\n${lyrics}`
        : '(no lyrics found — analyze by artist name, song title, and genre associations)';

    const analysis = await chat([{
        role: 'system',
        content: 'You are a synesthete, perfumer, and sommelier. You experience music through all senses. Be creative and poetic. Write in Russian.'
    }, {
        role: 'user',
        content: `Analyze the song "${title}" by "${artist}".
${lyricsBlock}

Describe in detail:
1. 3-5 COLORS this song feels like (specific shades with hex codes). Consider: minor key = cold/dark, major = warm/bright; heavy emotion = saturated, light = pastel; genre affects palette.
2. TASTE profile (main dish or drink, 2-3 sentence description, 3-6 taste keywords). Bitterness = pain/protest, sweetness = love/nostalgia, acidity = energy/irony, umami = depth/melancholy, saltiness = tears/freedom, spiciness = passion/rebellion.
3. SCENT PYRAMID: top notes (first impression), middle notes (heart of the song), base notes (what lingers after listening).
4. POETIC EXPLANATION: 2-3 sentences connecting the song's meaning to these associations.`
    }]);

    // Stage 2: extract into strict JSON (format:"json" guarantees valid JSON from Ollama)
    const structured = await chat([{
        role: 'system',
        content: 'You are a data extractor. Convert the provided analysis into the exact JSON schema given. Output ONLY valid JSON. All text values must be in Russian.'
    }, {
        role: 'user',
        content: `Convert this analysis into JSON matching this exact schema:
{
  "colors": [{"name": "color name", "hex": "#RRGGBB", "reason": "one phrase why"}],
  "taste": {"main": "one dish/drink", "description": "2-3 sentences", "notes": ["word1", "word2"]},
  "aroma": {"top": ["note1"], "middle": ["note1", "note2"], "base": ["note1"]},
  "explanation": "2-3 poetic sentences"
}

Analysis to convert:
${analysis}`
    }], true);

    return JSON.parse(structured);
}

// ── Route ─────────────────────────────────────────────────────────────────────

app.post('/api/analyze', async (req, res) => {
    const { artist, title } = req.body || {};
    if (!artist || !title) return res.status(400).json({ error: 'artist and title required' });

    try {
        const lyrics = await fetchLyrics(artist, title);
        const result = await callOllama(artist, title, lyrics);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Synesthesia → http://localhost:${PORT}`);
    console.log(`OpenRouter model: ${MODEL}`);
});
