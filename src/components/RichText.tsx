import type { ReactNode } from 'react'

/** Renders light markdown: **bold**, *italic*, and newlines. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n+/).filter(Boolean)

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index > 0 ? 'mt-4' : undefined}>
          {renderInline(paragraph)}
        </p>
      ))}
    </div>
  )
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
