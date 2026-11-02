import { FrenchText } from '@/components/dictionary/Dictionary'
import type { TableGroup } from '@/lib/tenses/tables'

/** Full tables, grouped. Plain HTML details so it works offline with no scripts. */
export function ConjugationGroups({ groups }: { groups: TableGroup[] }) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <details key={group.id} open={group.open} className="tactile-card overflow-hidden">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-4 py-3">
            <span>
              <span className="block text-body-ui font-bold text-on-surface">{group.title}</span>
              <span className="block text-sm text-on-surface-variant">{group.hint}</span>
            </span>
            <span className="text-label-caps text-primary">Open</span>
          </summary>
          <div className="grid gap-4 border-t p-4 sm:grid-cols-2">
            {group.tables.map((table) => (
              <section key={`${table.verb}-${table.tense}`} className="rounded-xl">
                <header className="border-b bg-surface-container-low px-3 py-2">
                  <p className="font-bold text-on-surface">{table.verb}</p>
                  <p className="text-xs text-on-surface-variant">{table.english} · {table.tense}</p>
                </header>
                <table className="w-full text-left text-body-ui">
                  <tbody>
                    {table.rows.map((row) => (
                      <tr key={row.pronoun} className="border-b last:border-0">
                        <td className="w-1/3 px-3 py-1.5 text-xs text-on-surface-variant">{row.pronoun}</td>
                        <td className="px-3 py-1.5 font-semibold text-ink-dark"><FrenchText text={row.phrase} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}
