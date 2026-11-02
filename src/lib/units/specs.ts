import type { VocabularyWord } from '@/lib/course'
import type { UnitSpec } from '@/lib/units/kit'
import { M2U1 } from '@/lib/units/m02-u1'
import { M2U2 } from '@/lib/units/m02-u2'
import { M2U3 } from '@/lib/units/m02-u3'
import { M2U4 } from '@/lib/units/m02-u4'
import { M2U5 } from '@/lib/units/m02-u5'

/** Hand-written unit lessons, in course order. Add each new unit here. */
export const UNIT_SPECS: UnitSpec[] = [M2U1, M2U2, M2U3, M2U4, M2U5]


function wordId(key: string, index: number): string {
  const [, module, unit] = key.match(/^m(\d+)u(\d+)$/) ?? ['', '0', '0']
  return `50000000-0000-0000-${module.padStart(4, '0')}-${(Number(unit) * 1000 + index).toString().padStart(12, '0')}`
}

/** Dictionary entries for every word the hand-written units teach. Written to index.generated.ts by scripts/emit-unit-index.ts. */
export const UNIT_VOCABULARY_SOURCE: VocabularyWord[] = UNIT_SPECS.flatMap((spec) =>
  spec.words
    .flatMap((group) => group.items)
    .map((word, index) => ({
      id: wordId(spec.key, index),
      word: word.fr,
      base_translation: word.en,
      meanings: word.en.split(';').map((meaning) => meaning.trim()),
      ...(word.example ? { example: { french: word.example[0], english: word.example[1] } } : {}),
      part_of_speech: word.pos,
      gender: word.gender ?? null,
      register: 'Courant',
      ipa_pronunciation: null,
      is_idiom: word.pos === 'phrase',
      is_slang: false,
      idiom_explanation: null,
    })),
)
