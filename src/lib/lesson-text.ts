import type { ConversationLine, ReadingParagraph, VocabularyWord } from '@/lib/course'
import { tokenizeFrench } from '@/lib/clickable-text'

const BULLET_RE = /^[-·•]\s+/
const SPEECH_RE = /^[—–]\s+/

/**
 * Put each spoken line of a story on its own line, starting with a dash (—), like a French novel.
 * « Bonjour ! » after "X dit :" or at the start of a sentence becomes a separate "— Bonjour !" line.
 * A short tag right after the quote ("demande-t-elle.") stays on the same line.
 * Quotes that are not full sentences (« you », a title) stay inline.
 */
export function splitSpeech(block: string): string {
  const lines: string[] = []
  let rest = block
  let narrative = ''
  const quote = /«\s*([^»]+?)\s*»/
  for (;;) {
    const match = rest.match(quote)
    if (!match || match.index === undefined) break
    const before = (narrative + rest.slice(0, match.index)).trimEnd()
    const content = match[1].trim()
    const startsSentence = before === '' || /[:.!?…»]$/.test(before)
    if (!/[.!?…]$/.test(content) || !startsSentence) {
      narrative = before + (before ? ' ' : '') + match[0]
      rest = rest.slice(match.index + match[0].length)
      continue
    }
    if (before) lines.push(before)
    narrative = ''
    rest = rest.slice(match.index + match[0].length)
    let line = `— ${content}`
    const tag = rest.match(/^\s*([a-zà-ÿ][^.!?«]*[.!?])/)
    if (tag) {
      line += ` ${tag[1].trim()}`
      rest = rest.slice(tag[0].length)
    }
    lines.push(line)
  }
  const tail = (narrative + rest).trim()
  if (tail) lines.push(tail)
  return lines.join('\n')
}

/** Build clickable reading paragraphs from plain French text.
 * Lines starting with `- `, `· `, or `• ` become bullet list items.
 * Use `\n` to separate intro prose from bullets in the same block.
 */
export function readingParagraphs(prefix: string, paragraphs: string[], vocabulary: VocabularyWord[]): ReadingParagraph[] {
  const result: ReadingParagraph[] = []
  let blockIndex = 0
  for (const [blockNumber, block] of paragraphs.entries()) {
    const fromSpeech = splitSpeech(block) !== block
    const lines = splitSpeech(block).split('\n').map((line) => line.trim()).filter(Boolean)
    for (const line of lines) {
      const listItem = BULLET_RE.test(line)
      const speech = SPEECH_RE.test(line)
      const text = listItem ? line.replace(BULLET_RE, '') : speech ? line.replace(SPEECH_RE, '— ') : line
      result.push({
        tokens: tokenizeFrench(text, `${prefix}-p${blockIndex}`, vocabulary),
        listItem,
        ...(speech ? { speech: true } : {}),
        ...(fromSpeech ? { story: blockNumber } : {}),
        ...(!speech && !listItem && /:\s*$/.test(line) ? { leadsSpeech: true } : {}),
      })
      blockIndex += 1
    }
  }
  return result
}

/** Build a clickable conversation line from plain French text. */
export function conversationLine(
  speaker: string,
  text: string,
  prefix: string,
  vocabulary: VocabularyWord[],
): ConversationLine {
  return {
    speaker,
    text,
    tokens: tokenizeFrench(text, prefix, vocabulary),
  }
}
