// ── Level Data & Math Validation ──────────────────────────────────────────────
// All mathematical answers, hints, and explanations for the 3 levels.

export const LEVELS = [
  // ─────────────────── LEVEL 1: Basic Access ───────────────────
  {
    id: 1,
    title: 'BASIC ACCESS',
    subtitle: 'Level 1',
    color: '#00e5ff',
    storyMessage: 'AKSES DITOLAK. Hitung nilai fungsi untuk memperoleh kode akses.',
    roomTheme: 'room1',
    maxScore: 20,
    stages: [
      {
        id: 'L1S1',
        title: 'Nilai Fungsi',
        problem: `Diketahui fungsi:\n\nh(x) = 2x + 3\n\nTentukan nilai h(4).`,
        type: 'numeric',
        answer: '11',
        hints: [
          'Masukkan nilai 4 pada setiap x di dalam fungsi.',
          'h(4) = 2 × (4) + 3. Kerjakan dari kiri ke kanan.',
        ],
        wrongFeedback: 'Belum tepat. Substitusikan x = 4 ke dalam fungsi, kemudian lakukan perkalian dan penjumlahan.',
        explanation: 'h(4) = 2(4) + 3 = 8 + 3 = 11 ✓',
      },
    ],
    successMessage: 'ACCESS GRANTED — PINTU 1 TERBUKA.',
  },

  // ─────────────────── LEVEL 2: Double Encryption ───────────────
  {
    id: 2,
    title: 'DOUBLE ENCRYPTION',
    subtitle: 'Level 2',
    color: '#ff9100',
    storyMessage: 'ENKRIPSI GANDA TERDETEKSI. Urutan fungsi menentukan hasil akhir.',
    roomTheme: 'room2',
    maxScore: 30,
    stages: [
      {
        id: 'L2S1',
        title: 'Komposisi Fungsi — Ekspresi',
        problem: `Diketahui:\nf(x) = 3x + 1\ng(x) = x + 2\n\nTentukan (f∘g)(x).`,
        type: 'expression',
        answer: '3x+7',
        answerVariants: ['3x+7', '3x + 7', '7+3x'],
        hints: [
          'Kerjakan fungsi g terlebih dahulu, kemudian masukkan hasilnya ke fungsi f.',
          '(f∘g)(x) = f(g(x)) = f(x+2). Substitusikan (x+2) ke dalam f.',
        ],
        wrongFeedback: 'Belum tepat. Ingat: (f∘g)(x) = f(g(x)). Masukkan g(x) = x+2 ke dalam f, lalu sederhanakan.',
        explanation: '(f∘g)(x) = f(g(x)) = f(x+2) = 3(x+2) + 1 = 3x + 6 + 1 = 3x + 7 ✓',
      },
      {
        id: 'L2S2',
        title: 'Komposisi Fungsi — Nilai',
        problem: `Gunakan hasil komposisi:\n(f∘g)(x) = 3x + 7\n\nTentukan nilai (f∘g)(2).`,
        type: 'numeric',
        answer: '13',
        hints: [
          'Substitusikan x = 2 ke hasil komposisi yang telah kamu temukan.',
          '(f∘g)(2) = 3(2) + 7 = ?',
        ],
        wrongFeedback: 'Belum tepat. Substitusikan x = 2 ke 3x + 7: hasilnya 3(2) + 7.',
        explanation: '(f∘g)(2) = 3(2) + 7 = 6 + 7 = 13 ✓',
      },
    ],
    successMessage: 'DOUBLE ENCRYPTION SOLVED — PINTU 2 TERBUKA.',
  },

  // ─────────────────── LEVEL 3: Final Decryption ────────────────
  {
    id: 3,
    title: 'FINAL DECRYPTION',
    subtitle: 'Level 3',
    color: '#00e676',
    storyMessage: 'FINAL SECURITY LOCK. Temukan fungsi komposisi, tentukan inversnya, lalu pulihkan pesan asli.',
    roomTheme: 'room3',
    maxScore: 50,
    stages: [
      {
        id: 'L3S1',
        title: 'Fungsi Enkripsi — Komposisi',
        problem: `Sistem enkripsi menggunakan:\ng(x) = 2x + 1\nf(x) = 3x + 2\n\nFungsi enkripsi E(x) = (f∘g)(x).\nTentukan E(x).`,
        type: 'expression',
        answer: '6x+5',
        answerVariants: ['6x+5', '6x + 5', '5+6x'],
        hints: [
          'Fungsi yang dikerjakan terakhir harus dibalik terlebih dahulu.',
          'E(x) = f(g(x)) = f(2x+1) = 3(2x+1) + 2. Sederhanakan.',
        ],
        wrongFeedback: 'Belum tepat. E(x) = f(g(x)). Substitusikan g(x) = 2x+1 ke dalam f, lalu distribusikan dan sederhanakan.',
        explanation: 'E(x) = f(g(x)) = f(2x+1) = 3(2x+1) + 2 = 6x + 3 + 2 = 6x + 5 ✓',
      },
      {
        id: 'L3S2',
        title: 'Fungsi Invers',
        problem: `Diketahui E(x) = 6x + 5.\n\nTentukan invers E⁻¹(x).\n(Tulis dalam bentuk: (x-5)/6)`,
        type: 'expression',
        answer: '(x-5)/6',
        answerVariants: ['(x-5)/6', 'x/6-5/6', '(x - 5) / 6', '(x-5) / 6'],
        hints: [
          'Terapkan fungsi invers pada setiap angka ciphertext.',
          'Misalkan y = 6x + 5, tukar x dan y: x = 6y + 5, selesaikan untuk y: y = (x-5)/6.',
        ],
        wrongFeedback: 'Belum tepat. Langkah: (1) misal y = 6x+5, (2) tukar variabel: x = 6y+5, (3) isolasi y: y = (x-5)/6.',
        explanation: 'y = 6x+5 → x = 6y+5 → 6y = x-5 → y = (x-5)/6\nJadi E⁻¹(x) = (x-5)/6 ✓',
      },
      {
        id: 'L3S3',
        title: 'Dekripsi Pesan',
        problem: `Terapkan E⁻¹(x) = (x-5)/6 pada setiap ciphertext:\n\nCiphertext: 67 – 127 – 85 – 23 – 59\n\nGunakan A=1, B=2, ..., Z=26.\nTuliskan pesan asli (semua huruf kapital).`,
        type: 'text',
        answer: 'KUNCI',
        hints: [
          'Gunakan hasil dekripsi sebagai angka huruf dengan aturan A=1 sampai Z=26.',
          'E⁻¹(67)=(67-5)/6=11=K, E⁻¹(127)=(127-5)/6=21=U, dan seterusnya.',
        ],
        wrongFeedback: 'Belum tepat. Terapkan (x-5)/6 pada setiap angka cipher, lalu konversi hasilnya ke huruf (A=1...Z=26).',
        explanation: 'E⁻¹(67)=11=K, E⁻¹(127)=21=U, E⁻¹(85)=14=N, E⁻¹(23)=3=C, E⁻¹(59)=9=I → KUNCI ✓',
        cipherData: {
          ciphers: [67, 127, 85, 23, 59],
          decrypted: [11, 21, 14, 3, 9],
          letters: ['K', 'U', 'N', 'C', 'I'],
        },
      },
    ],
    successMessage: 'DECRYPTION SUCCESSFUL — KODE KUNCI DITEMUKAN.',
  },
]

// ── Validation ──────────────────────────────────────────────────────────────

function normalizeExpression(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[()]/g, (m) => m) // keep parens
}

export function validateAnswer(stage, userAnswer) {
  const ua = userAnswer.trim()

  if (stage.type === 'numeric') {
    return ua === stage.answer || parseFloat(ua) === parseFloat(stage.answer)
  }

  if (stage.type === 'expression') {
    const norm = normalizeExpression(ua)
    const allValid = [stage.answer, ...(stage.answerVariants || [])].map(normalizeExpression)
    return allValid.includes(norm)
  }

  if (stage.type === 'text') {
    return ua.toUpperCase().replace(/\s+/g, '') === stage.answer.toUpperCase()
  }

  return false
}
