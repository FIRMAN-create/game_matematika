// ── Timer utility ────────────────────────────────────────────────────────────
export const TOTAL_TIME = 10 * 60 // 600 seconds = 10 minutes

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ── Score utility ────────────────────────────────────────────────────────────
export function calcHintPenalty(hintsUsed) {
  return Math.min(hintsUsed * 5, 100)
}

// ── Letter-Number conversion (A=1..Z=26) ─────────────────────────────────────
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function numToLetter(n) {
  if (n >= 1 && n <= 26) return ALPHABET[n - 1]
  return '?'
}

export function letterToNum(ch) {
  const idx = ALPHABET.indexOf(ch.toUpperCase())
  return idx === -1 ? null : idx + 1
}

// ── Math helpers ─────────────────────────────────────────────────────────────
export function encryptValue(x) {
  // E(x) = 6x + 5
  return 6 * x + 5
}

export function decryptValue(cipher) {
  // E⁻¹(x) = (x - 5) / 6
  return (cipher - 5) / 6
}
