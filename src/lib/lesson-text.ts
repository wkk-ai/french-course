import type { ConversationLine, ReadingParagraph, VocabularyWord } from '@/lib/course'
import { tokenizeFrench } from '@/lib/clickable-text'

/** Build clickable reading paragraphs from plain French text. */
export function readingParagraphs(prefix: string, paragraphs: string[], vocabulary: VocabularyWord[]): ReadingParagraph[] {
  return paragraphs.map((text, index) => ({
    tokens: tokenizeFrench(text, `${prefix}-p${index}`, vocabulary),
  }))
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
