const SETTINGS_KEY = 'english-shift-game-feel-v1'

type StorageRead = Pick<Storage, 'getItem'>

export type AtmosphereMode = 'select' | 'build' | 'review' | 'repair' | 'preview'

type StoreAudioProfile = {
  label: string
  tempo: number
  rootMidi: number
  pattern: Array<number | null>
  entry: number[]
  waveform: OscillatorType
  filterHz: number
  noteGain: number
  noteBeats: number
  stepBeats: number
  ambientGain: number
  ambientFilterHz: number
  ambientFilterType: BiquadFilterType
}

type ModeMix = {
  gain: number
  density: number
  detail: number
  entry: boolean
}

const MODE_MIX: Record<AtmosphereMode, ModeMix> = {
  // Quiet is the default learning mix. SELECT now matches the previous BUILD
  // loudness, while higher-cognitive-load modes step down further.
  select: { gain: 0.72, density: 0.80, detail: 0.75, entry: true },
  build: { gain: 0.55, density: 0.58, detail: 0.48, entry: true },
  review: { gain: 0.48, density: 0.42, detail: 0.30, entry: false },
  repair: { gain: 0.62, density: 0.65, detail: 0.55, entry: false },
  // Preview stays at reference level so users can hear the store identity clearly.
  preview: { gain: 1, density: 1, detail: 1, entry: true },
}

const SLOW_VARIATIONS = [0, 0, 2, 0, -3, 0, 5, 0, -2, 0]

export const STORE_AUDIO_PROFILES: Record<number, StoreAudioProfile> = {
  1: {
    label: 'Convenience Pulse', tempo: 92, rootMidi: 60,
    pattern: [0, 7, 9, 4, null, 7, 12, 9], entry: [0, 7],
    waveform: 'sine', filterHz: 1700, noteGain: 0.012, noteBeats: 1.7, stepBeats: 1.25,
    ambientGain: 0.0032, ambientFilterHz: 900, ambientFilterType: 'lowpass',
  },
  2: {
    label: 'Boutique Glass', tempo: 86, rootMidi: 62,
    pattern: [0, 4, 7, 11, 7, 4, null, 9], entry: [0, 4, 7],
    waveform: 'triangle', filterHz: 2200, noteGain: 0.0105, noteBeats: 1.45, stepBeats: 1.35,
    ambientGain: 0.0025, ambientFilterHz: 1350, ambientFilterType: 'lowpass',
  },
  3: {
    label: 'Trail Air', tempo: 76, rootMidi: 55,
    pattern: [0, 7, 12, null, 9, 7, 2, null], entry: [0, 7, 12],
    waveform: 'sine', filterHz: 1300, noteGain: 0.011, noteBeats: 2.2, stepBeats: 1.5,
    ambientGain: 0.0042, ambientFilterHz: 1900, ambientFilterType: 'highpass',
  },
  4: {
    label: 'Circuit Glow', tempo: 104, rootMidi: 52,
    pattern: [0, 7, 10, 14, 12, 7, 3, 10], entry: [0, 12, 7],
    waveform: 'sine', filterHz: 2900, noteGain: 0.0095, noteBeats: 1.2, stepBeats: 1.05,
    ambientGain: 0.0028, ambientFilterHz: 2100, ambientFilterType: 'bandpass',
  },
  5: {
    label: 'Café Warmth', tempo: 78, rootMidi: 60,
    pattern: [0, 4, 7, 9, null, 7, 4, 2], entry: [0, 4, 9],
    waveform: 'triangle', filterHz: 1450, noteGain: 0.0115, noteBeats: 1.9, stepBeats: 1.45,
    ambientGain: 0.0038, ambientFilterHz: 720, ambientFilterType: 'lowpass',
  },
  6: {
    label: 'Lobby Calm', tempo: 68, rootMidi: 53,
    pattern: [0, null, 7, 11, null, 16, 11, null], entry: [0, 7, 11],
    waveform: 'sine', filterHz: 1750, noteGain: 0.0105, noteBeats: 2.4, stepBeats: 1.75,
    ambientGain: 0.0024, ambientFilterHz: 820, ambientFilterType: 'lowpass',
  },
  7: {
    label: 'Department Stroll', tempo: 82, rootMidi: 58,
    pattern: [0, 4, 7, 9, 11, 7, 4, null], entry: [0, 4, 9],
    waveform: 'triangle', filterHz: 1850, noteGain: 0.0105, noteBeats: 1.7, stepBeats: 1.35,
    ambientGain: 0.0026, ambientFilterHz: 1050, ambientFilterType: 'lowpass',
  },
  8: {
    label: 'Flagship Horizon', tempo: 88, rootMidi: 50,
    pattern: [0, 7, 11, 14, 16, 19, 14, 11], entry: [0, 7, 11, 16],
    waveform: 'sine', filterHz: 2050, noteGain: 0.011, noteBeats: 2.1, stepBeats: 1.3,
    ambientGain: 0.0032, ambientFilterHz: 1250, ambientFilterType: 'lowpass',
  },
}

type AtmosphereSession = {
  token: number
  storeId: number
  mode: AtmosphereMode
  context: AudioContext
  master: GainNode
  ambientSource: AudioBufferSourceNode | null
  schedulerId: number
  nextNoteTime: number
  nextDetailTime: number
  step: number
  baseGain: number
  density: number
  detailScale: number
}

let audioContext: AudioContext | null = null
let session: AtmosphereSession | null = null
let tokenCounter = 0
let previewTimer: number | null = null
let noiseBuffer: AudioBuffer | null = null
let visibilityInstalled = false

function readMusicEnabled(storage?: StorageRead) {
  if (!storage) return true
  try {
    const raw = storage.getItem(SETTINGS_KEY)
    if (!raw) return true
    const parsed = JSON.parse(raw) as { music?: unknown }
    return typeof parsed.music === 'boolean' ? parsed.music : true
  } catch {
    return true
  }
}

function clampStoreId(storeId: number) {
  return Math.min(8, Math.max(1, Math.round(storeId)))
}

function midiToHz(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

function getAudioContext() {
  if (typeof window === 'undefined' || !window.AudioContext) return null
  if (!audioContext) audioContext = new AudioContext()
  if (audioContext.state === 'suspended') {
    void audioContext.resume().catch(() => undefined)
    const resume = () => { void audioContext?.resume().catch(() => undefined) }
    window.addEventListener('pointerdown', resume, { once: true, capture: true })
    window.addEventListener('keydown', resume, { once: true, capture: true })
  }
  installVisibilityHandling()
  return audioContext
}

function createNoiseBuffer(context: AudioContext) {
  if (noiseBuffer && noiseBuffer.sampleRate === context.sampleRate) return noiseBuffer
  const seconds = 2
  const frameCount = Math.max(1, Math.floor(context.sampleRate * seconds))
  const buffer = context.createBuffer(1, frameCount, context.sampleRate)
  const data = buffer.getChannelData(0)
  let brown = 0
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1
    brown = (brown + 0.018 * white) / 1.018
    data[i] = brown * 2.4
  }
  noiseBuffer = buffer
  return buffer
}

function scheduleTone(
  current: AtmosphereSession,
  profile: StoreAudioProfile,
  semitone: number,
  at: number,
  duration: number,
  gainAmount = profile.noteGain,
  waveform: OscillatorType = profile.waveform,
) {
  const { context, master } = current
  const oscillator = context.createOscillator()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  oscillator.type = waveform
  oscillator.frequency.setValueAtTime(midiToHz(profile.rootMidi + semitone), at)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(profile.filterHz, at)
  filter.Q.setValueAtTime(0.35, at)
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainAmount), at + 0.035)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(0.12, duration))
  oscillator.connect(filter)
  filter.connect(gain)
  gain.connect(master)
  oscillator.start(at)
  oscillator.stop(at + duration + 0.08)
}

function scheduleGlide(
  current: AtmosphereSession,
  fromMidi: number,
  toMidi: number,
  at: number,
  duration: number,
  gainAmount: number,
) {
  const oscillator = current.context.createOscillator()
  const gain = current.context.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(midiToHz(fromMidi), at)
  oscillator.frequency.exponentialRampToValueAtTime(midiToHz(toMidi), at + duration * 0.55)
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainAmount), at + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration)
  oscillator.connect(gain)
  gain.connect(current.master)
  oscillator.start(at)
  oscillator.stop(at + duration + 0.05)
}

function playEntryCue(current: AtmosphereSession, profile: StoreAudioProfile) {
  if (!MODE_MIX[current.mode].entry) return
  const start = current.context.currentTime + 0.045
  profile.entry.forEach((interval, index) => {
    scheduleTone(current, profile, interval + 12, start + index * 0.105, 0.24, profile.noteGain * 1.15)
  })
}

function startAmbientNoise(current: AtmosphereSession, profile: StoreAudioProfile) {
  const source = current.context.createBufferSource()
  const filter = current.context.createBiquadFilter()
  const gain = current.context.createGain()
  source.buffer = createNoiseBuffer(current.context)
  source.loop = true
  filter.type = profile.ambientFilterType
  filter.frequency.value = profile.ambientFilterHz
  filter.Q.value = profile.ambientFilterType === 'bandpass' ? 0.5 : 0.3
  gain.gain.value = profile.ambientGain
  source.connect(filter)
  filter.connect(gain)
  gain.connect(current.master)
  source.start()
  current.ambientSource = source
}

function variationForStep(step: number, patternLength: number) {
  // Each variation lasts two full phrases, so the harmonic change is slow enough
  // to avoid calling attention to itself while preventing a short-loop feeling.
  const phrase = Math.floor(step / Math.max(1, patternLength))
  const index = Math.floor(phrase / 2) % SLOW_VARIATIONS.length
  return SLOW_VARIATIONS[index]
}

function deterministicGate(current: AtmosphereSession) {
  const value = (current.step * 37 + current.storeId * 17 + Math.floor(current.step / 8) * 11) % 100
  return value / 100
}

function detailIntervalSeconds(current: AtmosphereSession) {
  // Roughly 22–38 seconds, deterministic per store/session phase.
  return 22 + ((current.storeId * 7 + current.step * 3) % 17)
}

function scheduleStoreDetail(current: AtmosphereSession) {
  const profile = STORE_AUDIO_PROFILES[current.storeId]
  const at = current.context.currentTime + 0.04
  const g = profile.noteGain * 0.34 * current.detailScale
  if (g < 0.0004) return

  switch (current.storeId) {
    case 1: // soft door/register-like chime
      scheduleTone(current, profile, 24, at, 0.22, g, 'sine')
      scheduleTone(current, profile, 31, at + 0.12, 0.28, g * 0.72, 'sine')
      break
    case 2: // airy glass shimmer
      scheduleTone(current, profile, 24, at, 0.38, g * 0.74, 'triangle')
      scheduleTone(current, profile, 28, at + 0.09, 0.45, g * 0.58, 'sine')
      scheduleTone(current, profile, 31, at + 0.17, 0.52, g * 0.46, 'sine')
      break
    case 3: // distant non-verbal outdoor chirp/air gesture
      scheduleGlide(current, profile.rootMidi + 24, profile.rootMidi + 31, at, 0.32, g * 0.58)
      scheduleGlide(current, profile.rootMidi + 28, profile.rootMidi + 33, at + 0.24, 0.26, g * 0.4)
      break
    case 4: // tiny electronic confirmation ping
      scheduleTone(current, profile, 24, at, 0.14, g * 0.8, 'sine')
      scheduleTone(current, profile, 36, at + 0.08, 0.16, g * 0.52, 'sine')
      break
    case 5: // subtle ceramic/cup-like clink, no crowd voices
      scheduleTone(current, profile, 31, at, 0.12, g * 0.64, 'triangle')
      scheduleTone(current, profile, 38, at + 0.055, 0.1, g * 0.44, 'sine')
      break
    case 6: // distant lobby bell/piano sparkle
      scheduleTone(current, profile, 19, at, 0.52, g * 0.68, 'sine')
      scheduleTone(current, profile, 24, at + 0.15, 0.62, g * 0.48, 'sine')
      break
    case 7: // broad-space department bell
      scheduleTone(current, profile, 24, at, 0.34, g * 0.7, 'triangle')
      scheduleTone(current, profile, 31, at + 0.18, 0.42, g * 0.42, 'sine')
      break
    case 8: // airy flagship shimmer
      scheduleTone(current, profile, 19, at, 0.66, g * 0.58, 'sine')
      scheduleTone(current, profile, 23, at + 0.14, 0.72, g * 0.44, 'sine')
      scheduleTone(current, profile, 26, at + 0.3, 0.78, g * 0.34, 'sine')
      break
  }
}

function applyMode(current: AtmosphereSession, mode: AtmosphereMode, rampMs = 180) {
  current.mode = mode
  const mix = MODE_MIX[mode]
  current.baseGain = mix.gain
  current.density = mix.density
  current.detailScale = mix.detail

  const now = current.context.currentTime
  current.master.gain.cancelScheduledValues(now)
  current.master.gain.setValueAtTime(Math.max(0.0001, current.master.gain.value), now)
  current.master.gain.linearRampToValueAtTime(current.baseGain, now + Math.max(0.04, rampMs / 1000))
}

function scheduleAhead(current: AtmosphereSession) {
  if (session?.token !== current.token) return
  if (typeof document !== 'undefined' && document.hidden) {
    current.nextNoteTime = current.context.currentTime + 0.25
    return
  }

  const profile = STORE_AUDIO_PROFILES[current.storeId]
  const beat = 60 / profile.tempo
  const horizon = current.context.currentTime + 1.1

  while (current.nextNoteTime < horizon) {
    const rawInterval = profile.pattern[current.step % profile.pattern.length]
    const variation = variationForStep(current.step, profile.pattern.length)
    const gate = deterministicGate(current)

    if (rawInterval != null && gate <= current.density) {
      const interval = rawInterval + variation
      const duration = beat * profile.noteBeats * (current.mode === 'review' ? 1.16 : 1)
      scheduleTone(current, profile, interval, current.nextNoteTime, duration)

      if (current.step % (profile.pattern.length * 2) === 0 && current.mode !== 'review') {
        scheduleTone(
          current,
          profile,
          interval - 12,
          current.nextNoteTime,
          duration * 1.25,
          profile.noteGain * 0.24,
        )
      }
    }

    current.step += 1
    current.nextNoteTime += beat * profile.stepBeats
  }

  if (current.context.currentTime >= current.nextDetailTime) {
    scheduleStoreDetail(current)
    current.nextDetailTime = current.context.currentTime + detailIntervalSeconds(current)
  }
}

function installVisibilityHandling() {
  if (visibilityInstalled || typeof document === 'undefined') return
  visibilityInstalled = true
  document.addEventListener('visibilitychange', () => {
    const current = session
    if (!current) return
    const now = current.context.currentTime
    current.master.gain.cancelScheduledValues(now)
    current.master.gain.setValueAtTime(Math.max(0.0001, current.master.gain.value), now)
    current.master.gain.linearRampToValueAtTime(document.hidden ? 0.0001 : current.baseGain, now + 0.12)
    if (!document.hidden) current.nextNoteTime = now + 0.12
  })
}

export function startStoreAtmosphere(
  storeId: number,
  storage?: StorageRead,
  mode: AtmosphereMode = 'select',
) {
  if (!readMusicEnabled(storage)) {
    stopStoreAtmosphere(80)
    return false
  }

  const context = getAudioContext()
  if (!context) return false
  const id = clampStoreId(storeId)

  if (session?.storeId === id) {
    applyMode(session, mode)
    if (context.state === 'suspended') void context.resume().catch(() => undefined)
    return true
  }

  stopStoreAtmosphere(90)
  const master = context.createGain()
  const compressor = context.createDynamicsCompressor()
  compressor.threshold.value = -26
  compressor.knee.value = 14
  compressor.ratio.value = 3
  compressor.attack.value = 0.02
  compressor.release.value = 0.25

  const mix = MODE_MIX[mode]
  master.gain.setValueAtTime(0.0001, context.currentTime)
  master.gain.linearRampToValueAtTime(mix.gain, context.currentTime + 0.55)
  master.connect(compressor)
  compressor.connect(context.destination)

  const token = ++tokenCounter
  const current: AtmosphereSession = {
    token,
    storeId: id,
    mode,
    context,
    master,
    ambientSource: null,
    schedulerId: 0,
    nextNoteTime: context.currentTime + 0.32,
    nextDetailTime: context.currentTime + 16 + id * 1.4,
    step: 0,
    baseGain: mix.gain,
    density: mix.density,
    detailScale: mix.detail,
  }

  session = current
  const profile = STORE_AUDIO_PROFILES[id]
  startAmbientNoise(current, profile)
  playEntryCue(current, profile)
  scheduleAhead(current)
  current.schedulerId = window.setInterval(() => scheduleAhead(current), 280)
  return true
}

export function setStoreAtmosphereMode(mode: AtmosphereMode) {
  const current = session
  if (!current) return false
  applyMode(current, mode)
  return true
}

export function stopStoreAtmosphere(fadeMs = 220) {
  if (previewTimer != null && typeof window !== 'undefined') {
    window.clearTimeout(previewTimer)
    previewTimer = null
  }

  const current = session
  session = null
  if (!current) return

  window.clearInterval(current.schedulerId)
  const now = current.context.currentTime
  const end = now + Math.max(0.02, fadeMs / 1000)
  current.master.gain.cancelScheduledValues(now)
  current.master.gain.setValueAtTime(Math.max(0.0001, current.master.gain.value), now)
  current.master.gain.linearRampToValueAtTime(0.0001, end)

  window.setTimeout(() => {
    try { current.ambientSource?.stop() } catch { /* already stopped */ }
    try { current.master.disconnect() } catch { /* already disconnected */ }
  }, Math.max(40, fadeMs + 80))
}

export function duckStoreAtmosphere(durationMs = 520) {
  const current = session
  if (!current) return

  const now = current.context.currentTime
  const duration = Math.max(0.18, durationMs / 1000)
  const gain = current.master.gain
  const duckTarget = Math.max(0.0001, current.baseGain * 0.22)
  gain.cancelScheduledValues(now)
  gain.setValueAtTime(Math.max(0.0001, gain.value), now)
  gain.linearRampToValueAtTime(duckTarget, now + 0.045)
  gain.linearRampToValueAtTime(current.baseGain, now + duration)
}

export function previewStoreAtmosphere(storeId = 1, storage?: StorageRead) {
  const started = startStoreAtmosphere(storeId, storage, 'preview')
  if (!started || typeof window === 'undefined') return false
  const token = session?.token
  if (previewTimer != null) window.clearTimeout(previewTimer)
  previewTimer = window.setTimeout(() => {
    if (session?.token === token) stopStoreAtmosphere(260)
  }, 5200)
  return true
}

export function currentStoreAtmosphere() {
  return session?.storeId ?? null
}

export function currentAtmosphereMode() {
  return session?.mode ?? null
}
