import { duckStoreAtmosphere } from './audioAtmosphere.js'

export const GAME_FEEL_SETTINGS_KEY = 'english-shift-game-feel-v1'

export type GameFeelEvent =
  | 'correct'
  | 'almost'
  | 'not_quite'
  | 'activity_complete'
  | 'shift_complete'
  | 'build_complete'
  | 'stamp'

export type GameFeelSettings = {
  music: boolean
  soundFx: boolean
  haptics: boolean
  celebrations: boolean
}

type SettingsStorage = Pick<Storage, 'getItem' | 'setItem'>

export const DEFAULT_GAME_FEEL_SETTINGS: GameFeelSettings = {
  music: true,
  soundFx: true,
  haptics: true,
  celebrations: true,
}

export function readGameFeelSettings(storage?: Pick<Storage, 'getItem'>): GameFeelSettings {
  if (!storage) return DEFAULT_GAME_FEEL_SETTINGS
  try {
    const raw = storage.getItem(GAME_FEEL_SETTINGS_KEY)
    if (!raw) return DEFAULT_GAME_FEEL_SETTINGS
    const parsed = JSON.parse(raw) as Partial<GameFeelSettings>
    return {
      music: typeof parsed.music === 'boolean' ? parsed.music : true,
      soundFx: typeof parsed.soundFx === 'boolean' ? parsed.soundFx : true,
      haptics: typeof parsed.haptics === 'boolean' ? parsed.haptics : true,
      celebrations: typeof parsed.celebrations === 'boolean' ? parsed.celebrations : true,
    }
  } catch {
    return DEFAULT_GAME_FEEL_SETTINGS
  }
}

export function saveGameFeelSettings(settings: GameFeelSettings, storage?: SettingsStorage) {
  storage?.setItem(GAME_FEEL_SETTINGS_KEY, JSON.stringify(settings))
}

let audioContext: AudioContext | null = null
let lastEvent: { id: GameFeelEvent; at: number } | null = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext
  if (!AudioContextClass) return null
  if (!audioContext) audioContext = new AudioContextClass()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

export function primeGameFeelAudio() {
  getAudioContext()
}

type Tone = {
  frequency: number
  delay: number
  duration: number
  gain: number
  type?: OscillatorType
}

const TONES: Record<GameFeelEvent, Tone[]> = {
  correct: [
    { frequency: 523.25, delay: 0, duration: 0.07, gain: 0.055 },
    { frequency: 659.25, delay: 0.065, duration: 0.08, gain: 0.05 },
    { frequency: 783.99, delay: 0.13, duration: 0.11, gain: 0.045 },
  ],
  almost: [
    { frequency: 440, delay: 0, duration: 0.07, gain: 0.038 },
    { frequency: 554.37, delay: 0.085, duration: 0.09, gain: 0.034 },
  ],
  not_quite: [
    { frequency: 293.66, delay: 0, duration: 0.08, gain: 0.026, type: 'triangle' },
    { frequency: 246.94, delay: 0.07, duration: 0.08, gain: 0.022, type: 'triangle' },
  ],
  activity_complete: [
    { frequency: 659.25, delay: 0, duration: 0.07, gain: 0.04 },
    { frequency: 783.99, delay: 0.07, duration: 0.1, gain: 0.04 },
  ],
  shift_complete: [
    { frequency: 523.25, delay: 0, duration: 0.08, gain: 0.045 },
    { frequency: 659.25, delay: 0.08, duration: 0.08, gain: 0.045 },
    { frequency: 783.99, delay: 0.16, duration: 0.09, gain: 0.045 },
    { frequency: 1046.5, delay: 0.25, duration: 0.18, gain: 0.04 },
  ],
  build_complete: [
    { frequency: 659.25, delay: 0, duration: 0.08, gain: 0.045 },
    { frequency: 783.99, delay: 0.085, duration: 0.1, gain: 0.045 },
    { frequency: 987.77, delay: 0.18, duration: 0.16, gain: 0.042 },
  ],
  stamp: [
    { frequency: 196, delay: 0, duration: 0.055, gain: 0.04, type: 'triangle' },
    { frequency: 659.25, delay: 0.055, duration: 0.08, gain: 0.03 },
  ],
}

const HAPTICS: Record<GameFeelEvent, number | number[]> = {
  // Keep answer feedback short. Completion moments are deliberately more
  // distinct so Android users can tell ordinary feedback from achievement.
  correct: 24,
  almost: 16,
  not_quite: 18,
  activity_complete: 26,
  shift_complete: [36, 42, 58],
  build_complete: [32, 38, 48],
  stamp: [18, 24, 30],
}

function playToneSequence(event: GameFeelEvent) {
  const context = getAudioContext()
  if (!context) return
  const start = context.currentTime + 0.005

  for (const tone of TONES[event]) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = tone.type ?? 'sine'
    oscillator.frequency.setValueAtTime(tone.frequency, start + tone.delay)
    gain.gain.setValueAtTime(0.0001, start + tone.delay)
    gain.gain.exponentialRampToValueAtTime(tone.gain, start + tone.delay + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.delay + tone.duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start + tone.delay)
    oscillator.stop(start + tone.delay + tone.duration + 0.025)
  }
}

function vibrate(event: GameFeelEvent) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  navigator.vibrate(HAPTICS[event])
}

export function playGameFeel(event: GameFeelEvent, storage?: Pick<Storage, 'getItem'>) {
  const now = Date.now()
  if (lastEvent?.id === event && now - lastEvent.at < 220) return
  lastEvent = { id: event, at: now }

  const settings = readGameFeelSettings(storage)
  if (settings.soundFx) {
    duckStoreAtmosphere(event === 'not_quite' ? 340 : 540)
    playToneSequence(event)
  }
  if (settings.haptics) vibrate(event)
}
