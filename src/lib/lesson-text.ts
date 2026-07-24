import type { ConversationLine, ReadingParagraph, VocabularyWord } from '@/lib/course'
import { tokenizeFrench } from '@/lib/clickable-text'

const BULLET_RE = /^[-·•]\s+/

/** Build clickable reading paragraphs from plain French text.
 * Lines starting with `- `, `· `, or `• ` become bullet list items.
 * Use `\n` to separate intro prose from bullets in the same block.
 */
export function readingParagraphs(prefix: string, paragraphs: string[], vocabulary: VocabularyWord[]): ReadingParagraph[] {
  const result: ReadingParagraph[] = []
  let blockIndex = 0
  for (const block of paragraphs) {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    for (const line of lines) {
      const listItem = BULLET_RE.test(line)
      const text = listItem ? line.replace(BULLET_RE, '') : line
      result.push({
        tokens: tokenizeFrench(text, `${prefix}-p${blockIndex}`, vocabulary),
        listItem,
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
