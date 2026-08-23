export interface ParsedMarkdown {
  data: Record<string, string>;
  body: string;
}

export function parseMarkdown(source: string): ParsedMarkdown {
  const match = source.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);

  if (!match) {
    return {
      data: {},
      body: source.trim()
    };
  }

  const data = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((accumulator, line) => {
      const separator = line.indexOf(":");

      if (separator === -1) {
        return accumulator;
      }

      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      accumulator[key] = value.replace(/^["']|["']$/g, "");
      return accumulator;
    }, {});

  return {
    data,
    body: match[2].trim()
  };
}

export function markdownParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}
