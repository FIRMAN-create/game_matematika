// ── AudioManager: Procedural Sci-Fi Ambient Music ────────────────────────────
// Generates a cyberpunk ambient soundtrack entirely via Web Audio API.
// No external audio files needed — works offline, zero loading time.
//
// Music structure:
//  • Bass drone     : deep sine at 55Hz (A1) with LFO tremolo
//  • Pad synth      : A-minor chord (A3-C4-E4) sawtooth + lowpass sweep
//  • Arpeggio       : triangle wave cycling A-minor pentatonic (high register)
//  • Noise texture  : bandpass white noise for "static" / "digital" feel
//  • Pulse rhythm   : synthetic kick every 1.6s for cyberpunk groove

let _instance = null

class AudioManagerClass {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.volume = 0.55
    this.muted = false
    this.isPlaying = false
    this._oscNodes = []       // oscillator / buffer-source nodes
    this._arpTimer = null
    this._pulseTimer = null
    this._padGains = []       // for real-time pad control
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  async start() {
    if (this.isPlaying) {
      // Resume if suspended (autoplay policy)
      if (this.ctx?.state === 'suspended') await this.ctx.resume()
      return
    }

    // Create AudioContext on first user gesture
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = this.muted ? 0 : this.volume
      this.masterGain.connect(this.ctx.destination)
    }

    if (this.ctx.state === 'suspended') await this.ctx.resume()

    this.isPlaying = true
    this._buildTrack()
  }

  stop() {
    this._oscNodes.forEach(n => {
      try { n.stop(0) } catch (_) {}
    })
    this._oscNodes = []
    this._padGains = []
    clearTimeout(this._arpTimer)
    clearTimeout(this._pulseTimer)
    this.isPlaying = false
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v))
    if (this.masterGain && !this.muted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.08)
    }
  }

  toggleMute() {
    this.muted = !this.muted
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.muted ? 0 : this.volume,
        this.ctx.currentTime,
        0.1
      )
    }
    return this.muted
  }

  isMuted() { return this.muted }
  getVolume() { return this.volume }

  // ── Private: build the full procedural track ────────────────────────────────

  _buildTrack() {
    this._buildBassDrone()
    this._buildPad()
    this._buildNoiseTexture()
    this._startArpeggio()
    this._startPulse()
  }

  // Layer 1 — Deep bass drone (A1 = 55Hz)
  _buildBassDrone() {
    const ctx = this.ctx

    const makeBassSine = (freq, gainVal, detune = 0) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.detune.value = detune
      g.gain.value = gainVal
      osc.connect(g)
      g.connect(this.masterGain)
      osc.start()
      this._oscNodes.push(osc)
      return { osc, g }
    }

    // Root, octave, slight detune (thickness)
    const b1 = makeBassSine(55, 0.30)
    const b2 = makeBassSine(110, 0.10)
    const b3 = makeBassSine(55, 0.08, 6)   // +6 cents detune

    // LFO tremolo on root bass
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 0.25  // very slow tremolo
    lfoGain.gain.value = 0.07
    lfo.connect(lfoGain)
    lfoGain.connect(b1.g.gain)
    lfo.start()
    this._oscNodes.push(lfo)
  }

  // Layer 2 — Ambient pad: Am chord with slow filter sweep + chorus
  _buildPad() {
    const ctx = this.ctx
    const now = ctx.currentTime

    // A-minor chord frequencies (A3, C4, E4, A4)
    const padFreqs = [110, 130.81, 164.81, 220, 261.63]

    padFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const chorusOsc = ctx.createOscillator()  // chorus
      const filter = ctx.createBiquadFilter()
      const reverb = ctx.createConvolver()
      const g = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.value = freq
      osc.detune.value = i % 2 === 0 ? 4 : -4  // mild chorus detune

      chorusOsc.type = 'sawtooth'
      chorusOsc.frequency.value = freq
      chorusOsc.detune.value = -8

      filter.type = 'lowpass'
      filter.Q.value = 1.2
      // Slow filter breathe
      const sweepLow = 180, sweepHigh = 900
      const period = 10 + i * 1.5
      filter.frequency.setValueAtTime(sweepLow, now)
      filter.frequency.linearRampToValueAtTime(sweepHigh, now + period / 2)
      filter.frequency.linearRampToValueAtTime(sweepLow, now + period)
      filter.frequency.linearRampToValueAtTime(sweepHigh, now + period * 1.5)
      filter.frequency.linearRampToValueAtTime(sweepLow, now + period * 2)

      g.gain.value = 0
      // Slow attack (2s)
      g.gain.setTargetAtTime(0.045, now, 2)

      osc.connect(filter)
      chorusOsc.connect(filter)
      filter.connect(g)
      g.connect(this.masterGain)

      osc.start()
      chorusOsc.start()
      this._oscNodes.push(osc, chorusOsc)
      this._padGains.push(g)
    })
  }

  // Layer 3 — Bandpass-filtered white noise ("digital static")
  _buildNoiseTexture() {
    const ctx = this.ctx
    const dur = 4  // seconds per noise buffer (loops)
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 3000
    filter.Q.value = 8

    const g = ctx.createGain()
    g.gain.value = 0.012

    src.connect(filter)
    filter.connect(g)
    g.connect(this.masterGain)
    src.start()
    this._oscNodes.push(src)
  }

  // Layer 4 — Arpeggio (A pentatonic minor, triangle, high register)
  _startArpeggio() {
    if (!this.isPlaying) return
    const ctx = this.ctx

    // A pentatonic minor: A4, C5, D5, E5, G5, A5
    const notes = [440, 523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 523.25]
    let idx = 0

    const playNote = () => {
      if (!this.isPlaying) return
      const now = ctx.currentTime
      const freq = notes[idx % notes.length]
      idx++

      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = 300

      osc.type = 'triangle'
      osc.frequency.value = freq

      const dur = 0.25
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.055, now + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, now + dur)

      osc.connect(filter)
      filter.connect(g)
      g.connect(this.masterGain)
      osc.start(now)
      osc.stop(now + dur + 0.05)
      // Do NOT push to _oscNodes — they self-stop

      // Irregular timing for organic feel
      const delay = 350 + Math.random() * 250
      this._arpTimer = setTimeout(playNote, delay)
    }

    // Start arpeggio after 3s (let pad/bass breathe in first)
    this._arpTimer = setTimeout(playNote, 3000)
  }

  // Layer 5 — Synthetic kick pulse (cyberpunk groove)
  _startPulse() {
    if (!this.isPlaying) return
    const ctx = this.ctx
    const now = ctx.currentTime

    // Kick: quick pitch drop sine
    const kick = ctx.createOscillator()
    const kickG = ctx.createGain()
    kick.type = 'sine'
    kick.frequency.setValueAtTime(90, now)
    kick.frequency.exponentialRampToValueAtTime(22, now + 0.18)
    kickG.gain.setValueAtTime(0.35, now)
    kickG.gain.exponentialRampToValueAtTime(0.001, now + 0.22)
    kick.connect(kickG)
    kickG.connect(this.masterGain)
    kick.start(now)
    kick.stop(now + 0.25)

    // Hi-hat on off-beat
    const hatTime = now + 0.8
    const hatBuf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate)
    const hatData = hatBuf.getChannelData(0)
    for (let i = 0; i < hatData.length; i++) hatData[i] = Math.random() * 2 - 1
    const hatSrc = ctx.createBufferSource()
    hatSrc.buffer = hatBuf
    const hatFilter = ctx.createBiquadFilter()
    hatFilter.type = 'highpass'
    hatFilter.frequency.value = 8000
    const hatG = ctx.createGain()
    hatG.gain.value = 0.06
    hatSrc.connect(hatFilter)
    hatFilter.connect(hatG)
    hatG.connect(this.masterGain)
    hatSrc.start(hatTime)

    this._pulseTimer = setTimeout(() => this._startPulse(), 1600)
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export function getAudioManager() {
  if (!_instance) _instance = new AudioManagerClass()
  return _instance
}
