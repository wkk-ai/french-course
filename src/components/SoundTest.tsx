'use client'

import { Volume2 } from 'lucide-react'
import { useState } from 'react'
import { speakFrench } from '@/components/SpeakButton'

/** Progress page row: play a French sentence and say what the phone reports, to debug silent audio. */
export function SoundTest() {
  const [status, setStatus] = useState('')
  const run = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatus('This browser has no speech. Open the app in Safari.')
      return
    }
    const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('fr'))
    setStatus(`Playing… French voices on this phone: ${voices.length}`)
    speakFrench('Bonjour ! Je m’appelle Lucas. J’habite à Lyon.', (state) => {
      if (state === 'speaking') setStatus(`Speaking now. French voices: ${voices.length}. Hear nothing? Turn silent mode off and the volume up.`)
      if (state === 'silent') setStatus(`The phone did not start speaking. French voices: ${voices.length}. Turn silent mode off, or download a French voice in Settings › Accessibility › Spoken Content › Voices.`)
      if (state === 'idle') setStatus((current) => (current.startsWith('Speaking') ? 'Done. If you heard it, sound works.' : current))
    })
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary"><Volume2 className="size-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-body-ui font-semibold">Sound</p>
        <p className="text-sm text-on-surface-variant">{status || 'Check that the listen button works'}</p>
      </div>
      <button type="button" onClick={run} className="tactile-button min-h-11 shrink-0 bg-white px-4 text-sm text-on-surface">Test</button>
    </div>
  )
}
