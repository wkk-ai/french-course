import type { ReactNode } from 'react'

/** Renders light markdown: **bold**, *italic*, newlines, and `- ` bullet lists. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = splitBlocks(text)

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <ul key={index} className={`list-disc space-y-1 pl-5 ${index > 0 ? 'mt-4' : ''}`}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={index} className={index > 0 ? 'mt-4' : undefined}>
            {renderInline(block.text)}
          </p>
        )
      })}
    </div>
  )
}

type Block = { type: 'paragraph'; text: string } | { type: 'list'; items: string[] }

function splitBlocks(text: string): Block[] {
  const lines = text.split('\n')
  const blocks: Block[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    const joined = paragraph.join(' ').trim()
    if (joined) blocks.push({ type: 'paragraph', text: joined })
    paragraph = []
  }
  const flushList = () => {
    if (list.length) blocks.push({ type: 'list', items: list })
    list = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const bullet = line.match(/^\s*-\s+(.*)$/)
    if (bullet) {
      flushParagraph()
      list.push(bullet[1])
      continue
    }
    if (!line.trim()) {
      flushList()
      flushParagraph()
      continue
    }
    flushList()
    paragraph.push(line.trim())
  }
  flushList()
  flushParagraph()
  return blocks
}

function renderInline(input: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > last) nodes.push(input.slice(last, match.index))
    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>)
    }
    last = match.index + token.length
  }

  if (last < input.length) nodes.push(input.slice(last))
  return nodes
}
