import { createLevelScene } from './BaseScene.js'

// ── Level 2: Double Encryption — Server Room ──────────────────────────────────
// Room: Dark server room with hexagonal floor, server racks.
// Theme: Orange (#ff9100)

export function getLevel2Scene(Phaser, gameState, callbacks) {

  function drawRoom(scene, W, H) {
    const g = scene.roomGraphics

    // Dark floor
    g.fillStyle(0x05080e, 1)
    g.fillRect(0, 0, W, H)

    // Hex grid floor (simplified)
    g.lineStyle(1, 0x0d1830, 0.9)
    const ts = 36
    for (let x = 0; x < W; x += ts) {
      for (let y = 35; y < H - 20; y += ts) {
        g.fillStyle((x / ts + Math.floor(y / ts)) % 2 === 0 ? 0x06090f : 0x070c14, 1)
        g.fillRect(x, y, ts, ts)
        g.strokeRect(x, y, ts, ts)
      }
    }

    // Server racks — left wall
    for (let rack = 0; rack < 3; rack++) {
      const rx = 18, ry = 50 + rack * 108
      g.fillStyle(0x0a1425, 1)
      g.fillRect(rx, ry, 62, 90)
      g.lineStyle(2, 0xff9100, 0.6)
      g.strokeRect(rx, ry, 62, 90)
      for (let r = 0; r < 5; r++) {
        const c = [0x00e676, 0xff9100, 0x1565ff, 0xff9100, 0x00e5ff][r]
        g.fillStyle(c, 0.85)
        g.fillCircle(rx + 12, ry + 12 + r * 14, 4)
        g.fillStyle(0x1e2d44, 1)
        g.fillRect(rx + 22, ry + 8 + r * 14, 32, 8)
      }
    }

    // Server racks — right wall
    for (let rack = 0; rack < 2; rack++) {
      const rx = W - 80, ry = 65 + rack * 135
      g.fillStyle(0x0a1425, 1)
      g.fillRect(rx, ry, 62, 110)
      g.lineStyle(1, 0x1565ff, 0.5)
      g.strokeRect(rx, ry, 62, 110)
      for (let r = 0; r < 6; r++) {
        g.fillStyle(0x4fc3f7, 0.5)
        g.fillRect(rx + 8, ry + 8 + r * 16, 48, 9)
      }
    }

    // Center console/platform (decorative)
    g.fillStyle(0x0c1828, 1)
    g.fillRoundedRect(W * 0.25, H * 0.35, W * 0.5, H * 0.3, 8)
    g.lineStyle(2, 0xff9100, 0.4)
    g.strokeRoundedRect(W * 0.25, H * 0.35, W * 0.5, H * 0.3, 8)

    // Ceiling
    g.fillStyle(0x030507, 1)
    g.fillRect(0, 0, W, 35)
    g.lineStyle(1, 0xff9100, 0.3)
    g.lineBetween(0, 35, W, 35)

    // Cable runs
    g.fillStyle(0x162030, 1)
    g.fillRect(W * 0.2, 0, 18, 35)
    g.fillRect(W * 0.65, 0, 18, 35)

    // Bottom
    g.fillStyle(0x030507, 1)
    g.fillRect(0, H - 20, W, 20)

    // Warning stripes
    for (let i = 0; i < 8; i++) {
      g.fillStyle(i % 2 === 0 ? 0xff9100 : 0x000000, 0.15)
      g.fillRect(W - 72 + i * 9, H - 62, 9, 42)
    }
  }

  return createLevelScene(Phaser, 'Level2Scene', {
    gameState,
    callbacks,
    roomLabel: '[ RUANG SERVER — DOUBLE ENCRYPTION ]',
    storyMessage: 'ENKRIPSI GANDA TERDETEKSI. Urutan fungsi menentukan hasil akhir.',
    successMessage: 'DOUBLE ENCRYPTION SOLVED — PINTU 2 TERBUKA!',
    terminalColor: 0xff9100,
    roomLayout: drawRoom,
    terminalX: (W) => W * 0.5,
    terminalY: (_, H) => H * 0.5,
    doorX: (W) => W - 44,
    doorY: (_, H) => H * 0.52,
    playerStartX: () => 80,
    playerStartY: (_, H) => H * 0.55,
  })
}
