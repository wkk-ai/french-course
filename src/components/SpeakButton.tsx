'use client'

import { Volume2 } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const supportsSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window

// Keep the utterance alive: Safari can garbage-collect it mid-speech and go silent.
let current: SpeechSynthesisUtterance | null = null

const NOVELTY = /grandma|grandpa|bad news|good news|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|bahh|fred|junior|ralph|kathy|rocko|shelley|sandy|reed|eddy|flo/i

function frenchVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | undefined {
  const voices = synth.getVoices().filter((voice) => voice.lang.toLowerCase().replace('_', '-').startsWith('fr'))
  const real = voices.filter((voice) => !NOVELTY.test(voice.name))
  return (
    real.find((voice) => voice.lang.toLowerCase().replace('_', '-') === 'fr-fr') ??
    real[0] ??
    voices[0]
  )
}

export function speakFrench(text: string, onState?: (state: 'speaking' | 'idle' | 'silent') => void) {
  const synth = window.speechSynthesis
  const clean = text.replace(/\s*\([^)]*\)/g, '').trim()
  if (!clean) return
  const start = () => {
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = 'fr-FR'
    utterance.rate = 0.9
    const voice = frenchVoice(synth)
    if (voice) utterance.voice = voice
    let started = false
    utterance.onstart = () => {
      started = true
      onState?.('speaking')
    }
    utterance.onend = () => onState?.('idle')
    utterance.onerror = () => onState?.(started ? 'idle' : 'silent')
    current = utterance
    synth.resume()
    synth.speak(utterance)
    // iPhone: no start event means the phone blocked the sound (silent switch, no voice).
    window.setTimeout(() => {
      if (!started && current === utterance) onState?.('silent')
    }, 2500)
  }
  // Calling cancel() and speak() in the same moment makes iPhone Safari drop the speech.
  if (synth.speaking || synth.pending) {
    synth.cancel()
    window.setTimeout(start, 120)
  } else {
    start()
  }
}

export function SpeakButton({ text, label = 'Listen' }: { text: string; label?: string }) {
  const supported = useSyncExternalStore(subscribe, supportsSpeech, () => false)
  const [state, setState] = useState<'speaking' | 'idle' | 'silent'>('idle')
  if (!supported) return null

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={() => speakFrench(text, setState)}
        aria-label={`${label}: ${text}`}
        className={`inline-flex size-11 items-center justify-center rounded-full text-primary hover:bg-primary-fixed/40 ${state === 'speaking' ? 'bg-primary-fixed/60' : ''}`}
      >
        <Volume2 className={`size-5 ${state === 'speaking' ? 'animate-pulse' : ''}`} />
      </button>
      {state === 'silent' && (
        <span
          role="status"
          className="absolute right-0 top-full z-20 mt-1 w-56 rounded-xl bg-on-surface px-3 py-2 text-xs leading-snug text-surface shadow-lg"
          onClick={() => setState('idle')}
        >
          No sound? Turn off silent mode (the switch on the side of the iPhone) and turn the volume up, then tap again.
        </span>
      )}
    </span>
  )
}
