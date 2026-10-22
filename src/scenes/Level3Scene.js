import { createLevelScene } from './BaseScene.js'

// ── Level 3: Final Decryption — Core Lab ──────────────────────────────────────
// Room: Deep space core with glowing machine, cipher panels, data streams.
// Theme: Green (#00e676)

export function getLevel3Scene(Phaser, gameState, callbacks) {

  function drawRoom(scene, W, H) {
    const g = scene.roomGraphics

    // Deep void background
    g.fillStyle(0x020306, 1)
    g.fillRect(0, 0, W, H)

    // Star field
    for (let i = 0; i < 70; i++) {
      const sx = Math.random() * W
      const sy = Math.random() * H
      const alpha = Math.random() * 0.5 + 0.1
      g.fillStyle(0xffffff, alpha)
      g.fillCircle(sx, sy, Math.random() < 0.2 ? 1.5 : 0.7)
    }

    // Octagonal floor tiles
    g.lineStyle(1, 0x152030, 1)
    const ts = 44
    for (let x = 0; x < W; x += ts) {
      for (let y = 35; y < H - 20; y += ts) {
        const alt = ((x / ts) + Math.floor(y / ts)) % 2 === 0
        g.fillStyle(alt ? 0x070f1c : 0x06101a, 1)
        g.fillRect(x, y, ts, ts)
        g.strokeRect(x, y, ts, ts)
      }
    }

    // ── Core machine (center-left) ──
    const mx = W * 0.22, my = H * 0.5
    // Outer ring glow
    g.fillStyle(0x00e676, 0.05)
    g.fillCircle(mx, my, 80)
    // Rings
    g.lineStyle(3, 0x00e676, 0.85)
    g.strokeCircle(mx, my, 58)
    g.lineStyle(1, 0x00e676, 0.4)
    g.strokeCircle(mx, my, 42)
    g.strokeCircle(mx, my, 26)
    // Spokes
    for (let a = 0; a < 8; a++) {
      const angle = (Math.PI / 4) * a
      g.lineBetween(mx + Math.cos(angle) * 26, my + Math.sin(angle) * 26, mx + Math.cos(angle) * 58, my + Math.sin(angle) * 58)
    }
    // Core fill
    g.fillStyle(0x00e676, 0.5)
    g.fillCircle(mx, my, 14)
    g.fillStyle(0xffffff, 0.9)
    g.fillCircle(mx, my, 5)
    // Body housing
    g.fillStyle(0x0d1b2a, 0.7)
    g.fillCircle(mx, my, 58)

    // ── Cipher panels (right side) ──
    const ciphers = ['67', '127', '85', '23', '59']
    ciphers.forEach((c, i) => {
      const row = Math.floor(i / 3)
      const col = i % 3
      const px = W * 0.55 + col * 68
      const py = H * 0.2 + row * 58
      g.fillStyle(0x0a1628, 1)
      g.fillRoundedRect(px - 25, py - 18, 54, 36, 5)
      g.lineStyle(1, 0x00e676, 0.55)
      g.strokeRoundedRect(px - 25, py - 18, 54, 36, 5)
    })

    // ── Vertical data streams ──
    g.lineStyle(1, 0x00e676, 0.12)
    for (let x = 60; x < W - 60; x += 32) {
      g.lineBetween(x, 35, x, H - 20)
    }

    // ── Exit tunnel ──
    g.fillStyle(0x00e676, 0.06)
    g.fillRect(W - 75, H * 0.3, 75, H * 0.4)

    // Ceiling
    g.fillStyle(0x020306, 1)
    g.fillRect(0, 0, W, 35)
    g.lineStyle(2, 0x00e676, 0.6)
    g.lineBetween(0, 35, W, 35)
    g.fillStyle(0x00e676, 0.07)
    g.fillRect(0, 0, W, 35)

    // Bottom
    g.fillStyle(0x020306, 1)
    g.fillRect(0, H - 20, W, 20)
    g.lineStyle(2, 0x00e676, 0.5)
    g.lineBetween(0, H - 20, W, H - 20)
  }

  const SceneClass = createLevelScene(Phaser, 'Level3Scene', {
    gameState,
    callbacks,
    roomLabel: '[ INTI LABORATORIUM — FINAL DECRYPTION ]',
    storyMessage: 'FINAL SECURITY LOCK. Temukan E(x), inversnya, dan dekripsi pesan.',
    successMessage: 'DECRYPTION SUCCESSFUL — KODE KUNCI DITEMUKAN!',
    terminalColor: 0x00e676,
    roomLayout: drawRoom,
    terminalX: (W) => W * 0.5,
    terminalY: (_, H) => H * 0.5,
    doorX: (W) => W - 44,
    doorY: (_, H) => H * 0.5,
    playerStartX: () => 80,
    playerStartY: (_, H) => H * 0.5,
  })

  return SceneClass
}
