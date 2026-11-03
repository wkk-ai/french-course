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

let unlockAudio: HTMLAudioElement | null = null

/** 0.2 s of silence as a WAV data URL (built once, no file needed). */
function silentWav(): string {
  const rate = 8000
  const samples = rate / 5
  const bytes = new Uint8Array(44 + samples)
  const view = new DataView(bytes.buffer)
  const text = (offset: number, value: string) => [...value].forEach((ch, i) => view.setUint8(offset + i, ch.charCodeAt(0)))
  text(0, 'RIFF'); view.setUint32(4, 36 + samples, true); text(8, 'WAVE'); text(12, 'fmt ')
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
  view.setUint32(24, rate, true); view.setUint32(28, rate, true); view.setUint16(32, 1, true); view.setUint16(34, 8, true)
  text(36, 'data'); view.setUint32(40, samples, true)
  bytes.fill(128, 44)
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return `data:audio/wav;base64,${btoa(binary)}`
}

/**
 * iPhone: speech is muted when the phone is on silent, but a playing <audio> element switches the
 * page to "media playback", which is not muted. Play a short silence first, inside the tap.
 */
function unlockIosAudio() {
  try {
    if (!unlockAudio) {
      unlockAudio = new Audio(silentWav())
      unlockAudio.setAttribute('playsinline', '')
    }
    unlockAudio.currentTime = 0
    void unlockAudio.play().catch(() => {})
  } catch {
    // not supported: speech may still work
  }
}

export function speakFrench(text: string, onState?: (state: 'speaking' | 'idle' | 'silent') => void) {
  unlockIosAudio()
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
          No sound? Turn silent mode off (Control Center bell, or the side button on older iPhones), turn the volume up and tap again. If it still fails: Settings › Accessibility › Spoken Content › Voices › French, download a voice.
        </span>
      )}
    </span>
  )
}
