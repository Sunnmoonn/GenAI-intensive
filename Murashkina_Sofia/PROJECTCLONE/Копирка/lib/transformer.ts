import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});

// Skip images — they add noise for LLM/RAG use cases
turndown.addRule('skipImages', {
  filter: 'img',
  replacement: () => '',
});

// Preserve <br> as a line break
turndown.addRule('lineBreak', {
  filter: 'br',
  replacement: () => '\n',
});

export function toMarkdown(html: string): string {
  if (!html.trim()) return '';
  try {
    const md = turndown.turndown(html);
    return md
      // Remove empty links left over when an image-only anchor is stripped: []()
      .replace(/\[[\s]*\]\([^)]*\)/g, '')
      // Collapse 3+ consecutive blank lines to 2
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } catch {
    return '';
  }
}
