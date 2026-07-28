import type { ReactNode } from 'react'

/** Renders light markdown: headings, bullets, numbered lists, **bold**, *italic*. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = splitBlocks(text)

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const Tag = block.level === 1 ? 'h2' : block.level === 2 ? 'h3' : 'h4'
          return (
            <Tag
              key={index}
              className={`font-bold text-on-surface ${index > 0 ? 'mt-5' : ''} ${
                block.level === 1 ? 'text-xl' : block.level === 2 ? 'text-lg' : 'text-base'
              }`}
            >
              {renderInline(block.text)}
            </Tag>
          )
        }
        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul'
          return (
            <ListTag
              key={index}
              className={`${block.ordered ? 'list-decimal' : 'list-disc'} space-y-1 pl-5 ${index > 0 ? 'mt-4' : ''}`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ListTag>
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

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[]; ordered: boolean }
  | { type: 'heading'; level: 1 | 2 | 3; text: string }

function splitBlocks(text: string): Block[] {
  const lines = text.split('\n')
  const blocks: Block[] = []
  let paragraph: string[] = []
  let list: string[] = []
  let listOrdered = false

  const flushParagraph = () => {
    const joined = paragraph.join(' ').trim()
    if (joined) blocks.push({ type: 'paragraph', text: joined })
    paragraph = []
  }
  const flushList = () => {
    if (list.length) blocks.push({ type: 'list', items: list, ordered: listOrdered })
    list = []
    listOrdered = false
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const heading = line.match(/^\s*(#{1,3})\s+(.*)$/)
    if (heading) {
      flushList()
      flushParagraph()
      blocks.push({
        type: 'heading',
        level: Math.min(3, heading[1].length) as 1 | 2 | 3,
        text: heading[2].trim(),
      })
      continue
    }
    const numbered = line.match(/^\s*\d+\.\s+(.*)$/)
    if (numbered) {
      flushParagraph()
      if (list.length && !listOrdered) flushList()
      listOrdered = true
      list.push(numbered[1])
      continue
    }
    const bullet = line.match(/^\s*-\s+(.*)$/)
    if (bullet) {
      flushParagraph()
      if (list.length && listOrdered) flushList()
      listOrdered = false
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
