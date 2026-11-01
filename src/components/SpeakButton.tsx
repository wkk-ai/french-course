'use client'

import { Volume2 } from 'lucide-react'
import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const supportsSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window

/**
 * Listen-only audio. The phone's own voice reads the French aloud.
 * No recording, no grading, no server. Hidden when the device has no speech support.
 */
export function SpeakButton({ text, label = 'Listen' }: { text: string; label?: string }) {
  const supported = useSyncExternalStore(subscribe, supportsSpeech, () => false)
  if (!supported) return null

  const speak = () => {
    const synth = window.speechSynthesis
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text.replace(/\s*\([^)]*\)/g, ''))
    utterance.lang = 'fr-FR'
    utterance.rate = 0.9
    const french = synth.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('fr'))
    if (french) utterance.voice = french
    synth.speak(utterance)
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`${label}: ${text}`}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary hover:bg-primary-fixed/40"
    >
      <Volume2 className="size-5" />
    </button>
  )
}
