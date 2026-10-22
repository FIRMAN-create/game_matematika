// ── Shared Phaser Scene Factory ───────────────────────────────────────────────
// Usage: const SceneClass = createLevelScene(Phaser, 'SceneName', config)
// Returns a class that extends Phaser.Scene

export const PLAYER_SPEED = 160
export const INTERACT_DISTANCE = 80

export function createLevelScene(Phaser, sceneKey, levelConfig) {

  class LevelScene extends Phaser.Scene {
    constructor() {
      super({ key: sceneKey })
      this.playerSpeed = PLAYER_SPEED
      this.interactDist = INTERACT_DISTANCE
      this.isNearTerminal = false
      this.doorOpened = false
      this.playerDir = 'right'
      this.dpadState = { up: false, down: false, left: false, right: false }
      this._termX = 0
      this._termY = 0
      this._doorX = 0
      this._doorY = 0
    }

    init(data) {
      if (data?.gameState) this.gameState = data.gameState
      if (data?.callbacks) this.callbacks = data.callbacks
      if (!this.gameState) this.gameState = levelConfig.gameState
      if (!this.callbacks) this.callbacks = levelConfig.callbacks
      // Reset per-scene state each time the scene (re)starts
      this.doorOpened = false
      this.isNearTerminal = false
      this._transitioning = false
      this.playerDir = 'right'
      this.dpadState = { up: false, down: false, left: false, right: false }
    }

    preload() {}

    create() {
      const W = this.scale.width
      const H = this.scale.height

      // ── Room background ──
      this.roomGraphics = this.add.graphics()
      levelConfig.roomLayout(this, W, H)

      // ── Static walls ──
      this.walls = this.physics.add.staticGroup()
      this._buildWalls(W, H)

      // ── Terminal ──
      const tx = levelConfig.terminalX(W, H)
      const ty = levelConfig.terminalY(W, H)
      this._termX = tx
      this._termY = ty
      this._drawTerminal(tx, ty, levelConfig.terminalColor || 0x00e5ff)

      // ── Door ──
      const dx = levelConfig.doorX(W, H)
      const dy = levelConfig.doorY(W, H)
      this._doorX = dx
      this._doorY = dy
      this._drawDoor(dx, dy)

      // ── Door lock label ──
      this.doorLabel = this.add.text(dx, dy - 60, '🔒 TERKUNCI', {
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '11px',
        color: '#ff5252',
        align: 'center',
      }).setOrigin(0.5)

      // ── Player ──
      const px = levelConfig.playerStartX(W, H)
      const py = levelConfig.playerStartY(W, H)
      this._createPlayer(px, py)

      // ── Colliders ──
      this.physics.add.collider(this.player, this.walls)

      // ── Input ──
      this.cursors = this.input.keyboard.createCursorKeys()
      this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        interact: Phaser.Input.Keyboard.KeyCodes.E,
      })

      // ── Mobile dpad ──
      this._dpadHandler = (e) => {
        const parts = e.detail.split('-')
        const dir = parts[0], action = parts[1]
        if (dir in this.dpadState) this.dpadState[dir] = action === 'down'
      }
      window.addEventListener('dpad', this._dpadHandler)

      // ── HUD label ──
      if (levelConfig.roomLabel) {
        this.add.text(12, 8, levelConfig.roomLabel, {
          fontFamily: '"Orbitron", monospace',
          fontSize: '11px',
          color: '#' + (levelConfig.terminalColor || 0x00e5ff).toString(16).padStart(6, '0'),
          alpha: 0.7,
        })
      }

      // ── Floating particles ──
      this._spawnParticles(W, H)

      // ── Story message ──
      this.storyText = this.add.text(W / 2, 20, levelConfig.storyMessage || '', {
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '10px',
        color: '#80deea',
        align: 'center',
        wordWrap: { width: W - 24 },
      }).setOrigin(0.5, 0).setAlpha(0.85)

      // ── Restore door state if previously opened ──
      if (this.gameState.doorOpen?.[this.gameState.currentLevel]) {
        this.doorOpened = true
        this._showDoorOpen(false)
      }
    }

    update() {
      if (!this.player || !this.player.body) return
      this._handleMovement()
      this._checkTerminal()
      this._checkDoorEntry()
    }

    // ── Called by React when player answers correctly ──
    openDoor() {
      if (this.doorOpened) return
      this.doorOpened = true
      this._showDoorOpen(true)
      if (this.storyText) this.storyText.setText(levelConfig.successMessage || '')
    }

    // ─── Private helpers ───────────────────────────────────────────────────────

    _buildWalls(W, H) {
      const thick = 20
      const borders = [
        [0, 0, W, thick],
        [0, H - thick, W, thick],
        [0, thick, thick, H - thick * 2],
        [W - thick, thick, thick, H - thick * 2],
      ]
      borders.forEach(([x, y, w, h]) => {
        const r = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x000000, 0)
        this.physics.add.existing(r, true)
        this.walls.add(r)
      })

      // Custom interior walls
      if (levelConfig.interiorWalls) {
        levelConfig.interiorWalls(W, H).forEach(([x, y, w, h]) => {
          const r = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x000000, 0)
          this.physics.add.existing(r, true)
          this.walls.add(r)
        })
      }
    }

    _createPlayer(px, py) {
      // Build player sprite texture programmatically
      const texKey = 'player_sprite'
      if (!this.textures.exists(texKey)) {
        const g = this.make.graphics({ add: false })
        // Legs
        g.fillStyle(0x1565ff, 1)
        g.fillRect(1, 22, 8, 14)
        g.fillRect(11, 22, 8, 14)
        // Body/suit
        g.fillStyle(0x00b8d4, 1)
        g.fillRect(0, 4, 20, 20)
        // Chest stripe
        g.fillStyle(0x00e5ff, 0.8)
        g.fillRect(7, 8, 6, 14)
        // Head
        g.fillStyle(0xffd08a, 1)
        g.fillCircle(10, 0, 9)
        // Helmet
        g.fillStyle(0x004d66, 0.85)
        g.fillRect(3, -6, 14, 10)
        // Visor
        g.fillStyle(0x00e5ff, 0.6)
        g.fillRect(4, -4, 12, 7)
        g.generateTexture(texKey, 20, 38)
        g.destroy()
      }

      this.player = this.physics.add.sprite(px, py, texKey)
      this.player.setCollideWorldBounds(true)
      this.player.body.setSize(16, 34)
      this.player.setDepth(5)

      // Shadow
      this.playerShadow = this.add.ellipse(px, py + 20, 18, 6, 0x000000, 0.4).setDepth(4)
    }

    _drawTerminal(x, y, color) {
      const g = this.add.graphics().setDepth(3)
      const hexColor = '#' + color.toString(16).padStart(6, '0')

      // Monitor body
      g.fillStyle(0x0d1b2a, 1)
      g.fillRoundedRect(x - 28, y - 44, 56, 52, 5)
      g.lineStyle(2, color, 0.85)
      g.strokeRoundedRect(x - 28, y - 44, 56, 52, 5)

      // Screen area
      g.fillStyle(color, 0.1)
      g.fillRect(x - 22, y - 38, 44, 40)

      // Screen scanlines
      for (let i = 0; i < 5; i++) {
        g.fillStyle(color, 0.25 - i * 0.04)
        g.fillRect(x - 18, y - 33 + i * 7, 36, 3)
      }

      // Monitor stand
      g.fillStyle(0x1a2840, 1)
      g.fillRect(x - 5, y + 8, 10, 10)
      g.fillRect(x - 15, y + 18, 30, 5)

      // Ambient glow
      g.fillStyle(color, 0.05)
      g.fillCircle(x, y - 10, 55)

      // Label
      this.add.text(x, y - 10, '[ TERMINAL ]', {
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '8px',
        color: hexColor,
      }).setOrigin(0.5).setDepth(4)

      // Blinking cursor
      this._termCursor = this.add.text(x - 4, y + 1, '▮', {
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '8px',
        color: hexColor,
      }).setDepth(4)

      this.time.addEvent({
        delay: 550, loop: true, callback: () => {
          if (this._termCursor) this._termCursor.setVisible(!this._termCursor.visible)
        },
      })
    }

    _drawDoor(x, y) {
      const lockedColor = 0xff1744

      // Door frame
      const frameG = this.add.graphics().setDepth(2)
      frameG.lineStyle(3, 0x334466, 1)
      frameG.strokeRect(x - 22, y - 58, 44, 74)
      frameG.fillStyle(0x111f33, 1)
      frameG.fillRect(x - 22, y - 58, 44, 74)
      frameG.lineStyle(2, 0x334466, 0.8)
      frameG.strokeRect(x - 22, y - 58, 44, 74)

      // Left door panel
      this._doorLeft = this.add.graphics().setDepth(3)
      this._doorLeft.fillStyle(0x0d1e36, 1)
      this._doorLeft.fillRect(0, 0, 20, 72)
      this._doorLeft.lineStyle(1, lockedColor, 0.5)
      this._doorLeft.strokeRect(0, 0, 20, 72)
      this._doorLeft.setPosition(x - 22, y - 58)

      // Right door panel
      this._doorRight = this.add.graphics().setDepth(3)
      this._doorRight.fillStyle(0x0d1e36, 1)
      this._doorRight.fillRect(0, 0, 20, 72)
      this._doorRight.lineStyle(1, lockedColor, 0.5)
      this._doorRight.strokeRect(0, 0, 20, 72)
      this._doorRight.setPosition(x + 2, y - 58)

      // Status light
      this._doorLight = this.add.circle(x, y - 66, 5, lockedColor).setDepth(4)
      this._doorLightRing = this.add.circle(x, y - 66, 9, lockedColor, 0.25).setDepth(4)

      // Blink the red light
      this.time.addEvent({
        delay: 700, loop: true, callback: () => {
          if (!this.doorOpened && this._doorLight) {
            this._doorLight.setAlpha(this._doorLight.alpha > 0.5 ? 0.3 : 1)
          }
        },
      })
    }

    _showDoorOpen(animated) {
      // Green light
      this._doorLight?.setFillStyle(0x00e676)
      this._doorLightRing?.setFillStyle(0x00e676)
      this.doorLabel?.setText('✅ TERBUKA').setStyle({ color: '#00e676' })

      if (!animated) {
        // Instant
        this._doorLeft?.setX(-300)
        this._doorRight?.setX(300)
        return
      }

      // Slide panels apart + flash
      const flashRect = this.add.rectangle(this._doorX, this._doorY, 50, 80, 0x00e676, 0.5).setDepth(6)
      this.tweens.add({ targets: flashRect, alpha: 0, duration: 450, onComplete: () => flashRect.destroy() })
      this.tweens.add({ targets: this._doorLeft, x: this._doorLeft.x - 80, duration: 650, ease: 'Power2' })
      this.tweens.add({ targets: this._doorRight, x: this._doorRight.x + 80, duration: 650, ease: 'Power2' })
      this.cameras.main.shake(250, 0.006)
    }

    _handleMovement() {
      const gs = this.gameState
      if (gs.showQuestion || gs.paused) {
        this.player.body.setVelocity(0, 0)
        return
      }

      const up = this.cursors.up.isDown || this.wasd.up.isDown || this.dpadState.up
      const down = this.cursors.down.isDown || this.wasd.down.isDown || this.dpadState.down
      const left = this.cursors.left.isDown || this.wasd.left.isDown || this.dpadState.left
      const right = this.cursors.right.isDown || this.wasd.right.isDown || this.dpadState.right

      let vx = 0, vy = 0
      if (left) { vx = -this.playerSpeed; this.playerDir = 'left' }
      if (right) { vx = this.playerSpeed; this.playerDir = 'right' }
      if (up) vy = -this.playerSpeed
      if (down) vy = this.playerSpeed

      if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707 }

      this.player.body.setVelocity(vx, vy)
      this.player.setFlipX(this.playerDir === 'left')

      // Sync shadow
      if (this.playerShadow) {
        this.playerShadow.setPosition(this.player.x, this.player.y + 20)
      }

      // Walk bob
      if (vx !== 0 || vy !== 0) {
        this.player.y += Math.sin(this.time.now / 100) * 0.3
      }
    }

    _checkTerminal() {
      if (!this.player) return
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this._termX, this._termY)
      const near = dist < this.interactDist

      if (near !== this.isNearTerminal) {
        this.isNearTerminal = near
        this.callbacks.updateNearTerminal(near)
      }

      // E key
      if (near && Phaser.Input.Keyboard.JustDown(this.wasd.interact)) {
        const gs = this.gameState
        if (!gs.showQuestion && !gs.paused && !gs.ended) {
          this.callbacks.openQuestion()
        }
      }
    }

    _checkDoorEntry() {
      if (!this.doorOpened || !this.player || this._transitioning) return
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this._doorX, this._doorY)
      if (dist < 55) {
        this._transitioning = true
        this.doorOpened = false
        // Stop player movement
        if (this.player.body) this.player.body.setVelocity(0, 0)
        this.cameras.main.fadeOut(600, 0, 0, 0)
        this.time.delayedCall(650, () => {
          window.removeEventListener('dpad', this._dpadHandler)
          this.callbacks.advanceLevel()
        })
      }
    }

    _spawnParticles(W, H) {
      this._pts = []
      const color = levelConfig.terminalColor || 0x00e5ff
      for (let i = 0; i < 18; i++) {
        const p = this.add.rectangle(
          Phaser.Math.Between(0, W),
          Phaser.Math.Between(35, H - 20),
          Phaser.Math.Between(1, 3),
          Phaser.Math.Between(1, 3),
          color,
          Phaser.Math.FloatBetween(0.08, 0.35)
        ).setDepth(1)
        this._pts.push({ obj: p, vy: -Phaser.Math.FloatBetween(0.15, 0.4), vx: Phaser.Math.FloatBetween(-0.1, 0.1) })
      }

      this.time.addEvent({
        delay: 40, loop: true, callback: () => {
          if (!this._pts) return
          this._pts.forEach(({ obj, vy, vx }) => {
            obj.y += vy; obj.x += vx
            if (obj.y < 35) { obj.y = H - 20; obj.x = Phaser.Math.Between(0, W) }
          })
        },
      })
    }

    shutdown() {
      window.removeEventListener('dpad', this._dpadHandler)
    }
  }

  return LevelScene
}
