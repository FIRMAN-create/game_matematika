import { createLevelScene } from './BaseScene.js'

// ── Level 1: Basic Access — Laboratory Entrance ──────────────────────────────
// Room: Navy-blue lab entrance with ceiling lights and wall monitors.
// Theme: Cyan (#00e5ff)

export function getLevel1Scene(Phaser, gameState, callbacks) {

  function drawRoom(scene, W, H) {
    const g = scene.roomGraphics

    // Floor
    g.fillStyle(0x071220, 1)
    g.fillRect(0, 0, W, H)

    // Floor tiles
    g.lineStyle(1, 0x0d2035, 0.7)
    for (let x = 0; x < W; x += 48) g.lineBetween(x, 35, x, H - 20)
    for (let y = 35; y < H - 20; y += 48) g.lineBetween(0, y, W, y)

    // Ceiling
    g.fillStyle(0x040d1a, 1)
    g.fillRect(0, 0, W, 35)

    // Ceiling lights
    ;[W * 0.22, W * 0.5, W * 0.78].forEach(lx => {
      g.fillStyle(0x00e5ff, 0.08)
      g.fillEllipse(lx, 50, 100, 140)
      g.fillStyle(0xeef9ff, 0.9)
      g.fillRect(lx - 22, 28, 44, 7)
      g.lineStyle(1, 0x00e5ff, 0.5)
      g.strokeRect(lx - 22, 28, 44, 7)
    })

    // Left wall — big monitor panel
    g.fillStyle(0x0d1b2a, 1)
    g.fillRect(22, 50, 90, 130)
    g.lineStyle(1, 0x00e5ff, 0.35)
    g.strokeRect(22, 50, 90, 130)
    for (let i = 0; i < 7; i++) {
      g.fillStyle(0x00e5ff, 0.18 - i * 0.015)
      g.fillRect(30, 58 + i * 17, 74, 10)
    }
    g.fillStyle(0x00e5ff, 0.12)
    g.fillRect(30, 175, 30, 4)
    g.fillRect(64, 175, 30, 4)

    // Right wall — status panel
    g.fillStyle(0x0a1628, 1)
    g.fillRect(W - 112, 45, 90, 100)
    g.lineStyle(1, 0x1565ff, 0.4)
    g.strokeRect(W - 112, 45, 90, 100)
    ;[0, 1, 2, 3].forEach(i => {
      const c = [0x00e676, 0xff9100, 0x00e5ff, 0xff1744][i]
      g.fillStyle(c, 0.75)
      g.fillCircle(W - 100 + (i % 2) * 36, 68 + Math.floor(i / 2) * 35, 6)
    })
    for (let i = 0; i < 3; i++) {
      g.fillStyle(0x4fc3f7, 0.25)
      g.fillRect(W - 100, 60 + i * 28, 60, 5)
    }

    // Warning stripes near door
    for (let i = 0; i < 8; i++) {
      g.fillStyle(i % 2 === 0 ? 0xff9100 : 0x000000, 0.18)
      g.fillRect(W - 68 + i * 8, H - 60, 8, 40)
    }

    // Bottom wall strip
    g.fillStyle(0x040d1a, 1)
    g.fillRect(0, H - 20, W, 20)
  }

  return createLevelScene(Phaser, 'Level1Scene', {
    gameState,
    callbacks,
    roomLabel: '[ RUANG MASUK — BASIC ACCESS ]',
    storyMessage: 'AKSES DITOLAK. Hitung nilai fungsi untuk memperoleh kode akses.',
    successMessage: 'ACCESS GRANTED — PINTU 1 TERBUKA!',
    terminalColor: 0x00e5ff,
    roomLayout: drawRoom,
    terminalX: (W) => W * 0.38,
    terminalY: (_, H) => H * 0.52,
    doorX: (W) => W - 44,
    doorY: (_, H) => H * 0.55,
    playerStartX: () => 70,
    playerStartY: (_, H) => H * 0.55,
  })
}
