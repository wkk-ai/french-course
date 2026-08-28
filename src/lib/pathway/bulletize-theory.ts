/** Theory renderer joins non-dash lines into one paragraph. Keep examples as list items. */

const SPEAKER =
  /^(A|B|Friend|You|Classmate|Teacher|Colleague|Ami|Toi|Boss|Office|School|Student|Cover the French|More formal|Everyday|Very casual|Right|Wrong)\b/i

export function bulletizeTheory(body: string): string {
  return body
    .split('\n')
    .map((raw) => {
      const line = raw.trimEnd()
      const trimmed = line.trim()
      if (!trimmed) return line
      if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) return line
      if (/^\s*\*\*\d+\./.test(line) || /^\s*#{1,3}\s/.test(line)) return line
      if (/→/.test(trimmed) || SPEAKER.test(trimmed)) {
        return `- ${trimmed}`
      }
      return line
    })
    .join('\n')
}
