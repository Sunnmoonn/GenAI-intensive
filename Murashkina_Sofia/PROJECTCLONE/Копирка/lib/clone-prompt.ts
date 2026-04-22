import type { ScrapeResult } from './types';

/**
 * Generates a Claude Code–ready prompt to recreate the scraped site as a Next.js project.
 * Contains full design context, content, and structure so the model can reproduce
 * the project functionally and visually without visiting the original URL.
 */
export function generateClonePrompt(result: ScrapeResult): string {
  const dc = result.designContext;

  // --- Design section ---
  const designLines: string[] = [];

  if (dc.colorScheme !== 'unknown') {
    designLines.push(`- Color scheme: **${dc.colorScheme}** mode`);
  }
  if (dc.themeColor) {
    designLines.push(`- Brand/theme color: \`${dc.themeColor}\``);
  }
  if (dc.ogImageUrl) {
    designLines.push(`- OG image (visual reference): ${dc.ogImageUrl}`);
  }
  if (dc.fontFamilies.length > 0) {
    designLines.push(`- Fonts: ${dc.fontFamilies.join(', ')}`);
  }
  if (dc.tailwindDetected) {
    designLines.push(`- CSS framework: **Tailwind CSS** (detected in original)`);
  } else if (dc.bootstrapDetected) {
    designLines.push(`- CSS framework: **Bootstrap** (detected in original)`);
  }
  if (dc.layoutType !== 'unknown') {
    designLines.push(`- Layout pattern: ${dc.layoutType}`);
  }
  if (dc.cssVariables.length > 0) {
    designLines.push(
      `- CSS design tokens from original:\n${dc.cssVariables.map(v => `  \`${v.trim()}\``).join('\n')}`,
    );
  }
  if (dc.primaryColors.length > 0) {
    designLines.push(`- Inline colors found: ${dc.primaryColors.slice(0, 6).join(', ')}`);
  }

  const designBlock =
    designLines.length > 0
      ? designLines.join('\n')
      : '_No design tokens detected — infer a clean, modern aesthetic from the content type._';

  // --- Structure section ---
  const headingsBlock =
    result.headings.length > 0
      ? result.headings
          .slice(0, 30)
          .map(h => `${'  '.repeat(h.level - 1)}- ${'#'.repeat(h.level)} ${h.text}`)
          .join('\n')
      : '_No headings found._';

  // Navigation links (internal only)
  const navLinks = result.links
    .filter(l => !l.isExternal)
    .slice(0, 20)
    .map(l => `- [${l.text}](${l.href})`)
    .join('\n');

  // --- Content section ---
  const MAX_CONTENT_CHARS = 8_000;
  const contentBlock =
    result.markdown.length > MAX_CONTENT_CHARS
      ? result.markdown.slice(0, MAX_CONTENT_CHARS) + '\n\n_[content truncated — include all visible text above]_'
      : result.markdown;

  return `# Clone this website as a Next.js project

## Source
- **URL:** ${result.url}
- **Title:** ${result.title}${result.description ? `\n- **Description:** ${result.description}` : ''}
- **Content size:** ~${result.wordCount} words

---

## Design context

${designBlock}

---

## Page structure (headings hierarchy)

${headingsBlock}

${navLinks ? `---\n\n## Navigation / internal links\n\n${navLinks}\n` : ''}
---

## Full page content (markdown)

${contentBlock}

---

## Your task

You are Claude Code. Create a **complete, runnable Next.js project** that recreates this website.

### Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- No external data fetching — all content is hardcoded from the markdown above

### Requirements

1. **Match the design** — use the color scheme, fonts, and layout pattern from the design context above. If dark mode was detected, implement it as the default. Recreate the visual hierarchy faithfully.

2. **All content** — include every heading, paragraph, list, code block, and link from the markdown. Do not use placeholder or lorem ipsum text.

3. **Project structure** — at minimum:
   \`\`\`
   app/
     layout.tsx      ← fonts, metadata, global wrapper
     page.tsx        ← main page content
     globals.css     ← CSS variables / base styles
   components/       ← Header, Footer, any reusable sections
   tailwind.config.ts
   \`\`\`

4. **Responsive** — mobile-first, works on all screen sizes.

5. **Runnable** — \`npm install && npm run dev\` must work with zero errors.

6. **No placeholders** — if something can't be recreated (e.g. interactive maps, auth), replace it with a static representation and add a \`// TODO:\` comment.

### Deliver

Output all files needed to run the project. Start with \`package.json\`, then \`tailwind.config.ts\`, then \`app/layout.tsx\`, \`app/page.tsx\`, and any components. Each file should be clearly labeled with its path.`.trim();
}
