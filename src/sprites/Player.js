const RIGHT = 0
const LEFT = 1

const data = {}
data[RIGHT] = {
  bodyFrame: 'player',
  armFrame: 'player_arm',
  position: {
    x: 6 / 2,
    y: 96 / 2
  },
  pivot: {
    x: 14 / 2,
    y: 10 / 2
  },
  maxArmAngle: 40,
  minArmAngle: -80,
  weaponPosition: {
    x: 72,
    y: 18
  },
  baseAngle: 0,
  rotate: 1
}

data[LEFT] = {
  bodyFrame: 'player_left',
  armFrame: 'player_arm_left',
  position: {
    x: 107 / 2,
    y: 96 / 2
  },
  pivot: {
    x: 14 / 2,
    y: 58 / 2
  },
  maxArmAngle: -100,
  minArmAngle: -180,
  weaponPosition: {
    x: 72,
    y: 18
  },
  baseAngle: -180,
  rotate: -1
}

export default class Player {
  constructor (game, x, y, direction, showStartTutor) {
    this.game = game
    this.name = 'player'
    this.data = data[direction]
    this.body = game.add.image(x, y, this.data.bodyFrame)
    this.direction = direction || RIGHT
    this.disabled = false
    if (showStartTutor === undefined) {
      showStartTutor = true
    }
    this.showStartTutor = showStartTutor

    this.minArmAngle = this.data.minArmAngle
    this.maxArmAngle = this.data.maxArmAngle
    const arm = game.add.image(this.body.x + this.data.position.x, this.body.y + this.data.position.y, this.data.armFrame)
    arm.pivot.set(this.data.pivot.x, this.data.pivot.y)
    arm.angle = this.data.baseAngle
    this.arm = arm

    const weapon = game.add.weapon(1, 'bullet')
    weapon.bulletSpeed = 1000
    weapon.trackSprite(arm, this.data.weaponPosition.x, this.data.weaponPosition.y, true)
    weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS
    this.weapon = weapon

    this.firingTarget = game.add.image(0, 0, 'target')
    this.firingTarget.anchor.set(0.5)
    this.firingTarget.visible = false
    this.firingTargetPoint = null
    
    this.firingLine = new Phaser.Line()
    this.firingLineG = game.add.graphics()
    this._rotatedPoint = new Phaser.Point(0, 0)

    this.lastPointerPosition = null

    game.input.onDown.add(() => {
      if (this.disabled) {
        return
      }
      if (this.tutor) {
        this.hideTutor()
      }
      this.stopTimer()
      game.input.addMoveCallback(this._handleMove, this)
      this.readyToShot = true
    })

    game.input.onUp.add(() => {
      if (this.disabled) {
        return
      }
      if (!this.readyToShot) {
        return
      }
      this.startTimer()

      game.input.deleteMoveCallback(this._handleMove, this)
      this.lastPointerPosition = null
      
      this.fire()
      this.readyToShot = false
    })

    if (this.showStartTutor) {
      this.showTutor()
    } else {
      this.startTimer()
    }
  }

  fire () {
    const bullet = this.weapon.fire()
    if (bullet) {
      this.bullet = bullet
      this.bullet.body.bounce.set(1)

      const emitter = game.add.emitter(bullet.x, bullet.y, 400)
      emitter.makeParticles('particle')
      emitter.minParticleSpeed.set(-10, -10)
      emitter.maxParticleSpeed.set(10, 10)
      emitter.autoAlpha = true
      emitter.setAlpha(1, 0)
      emitter.flow(400, 10, 10)
      this.emitter = emitter
      this.weapon.onKill.addOnce(() =>{ 
        emitter.on = false
        setTimeout(() => {
          emitter.destroy()
        }, 500)
      })
    }
  }

  startTimer() {
    if (this.timer) {
      return
    }
    const game = this.game
    this.timer = game.time.create()
    this.timer.add(Phaser.Timer.SECOND * 5, this.showTutor, this)
    this.timer.start()
  }

  addHelperLines (lines) {
    if (!this.helperLines) {
      this.helperLines = []
    }
    for (let name in lines) {
      let linePoints = lines[name]

      if (linePoints.length >= 2) {
        this.helperLines.push(new Phaser.Line(linePoints[0].x, linePoints[0].y, linePoints[1].x, linePoints[1].y))
      }
    }
  }
  
  restartTimer () {
    this.stopTimer()
    this.startTimer()
  }
  stopTimer() {
    if (this.timer) {
      this.timer.destroy()
      this.timer = null
    }
  }

  showTutor() {
    const game = this.game
    const {width, height} = game

    this.tutor = true
    this.tutorContainer = game.add.group(game.stage, 'Tutor Container')

    const _text = game.make.text(0, 0, 'swipe to shoot', {
      font           : 'notosans',
      fontSize       : 80,
      fill           : '#ffffff',
      stroke         : '#000000',
      strokeThickness: 5,
      align          : 'center',
      wordWrap       : true,
      wordWrapWidth  : 500
    })
    this.text = game.make.image(0, 0, _text.generateTexture())
    this.text.anchor.set(0.5)
    this.tutorContainer.add(this.text)
    game.add.tween(this.text.scale)
      .to({x: 1.1, y: 1.1})
      .repeat(-1)
      .yoyo(true)
      .start()

    this.swipeContainer = game.make.group(this.tutorContainer, 'swipe')
    this.hand = game.make.image(0, 0, 'hand')
    this.hand.anchor.set(0.5, 0.5)
    this.swipeContainer.add(this.hand)

    this.hand.alpha = 0
    const showHand = game.add.tween(this.hand)
      .to({alpha: [0, 1]}, Phaser.Timer.SECOND * 0.5)
      .delay(Phaser.Timer.SECOND * 3)
      .start()

    const tapTween = game.add.tween(this.hand.scale)
      .to({x: 0.8, y: 0.8}, Phaser.Timer.SECOND * 0.4)

    const pointsY = [0, 100]
    const pointsX = [0, 70, 0]

    const moveHand = game.add.tween(this.hand)
      .to({y: pointsY, x: pointsX}, Phaser.Timer.SECOND * 1.5)
      .interpolation(Phaser.Math.bezierInterpolation)
      .repeat(-1)
      .repeatDelay(Phaser.Timer.SECOND * 0.6)

    showHand.chain(tapTween)
    tapTween.chain(moveHand)

    const showTutor = game.add.tween(this.tutorContainer)
      .from({alpha: 0}, Phaser.Timer.SECOND * 0.4)
      .start()

    this.resizeTutor()
  }

  hideTutor() {
    this.tutor = false
    const hide = game.add.tween(this.tutorContainer)
      .to({alpha: 0})
      .start()

    hide.onComplete.addOnce(() => {
      this.tutorContainer.destroy(true)
    })
  }

  disable () {
    this.disabled = true
    this.stopTimer()
  }

  resizeTutor () {
    const game = this.game
    const {scale, width, height} = game

    if (this.tutor) {

      scale.scaleSprite(this.text, width * 0.6, height * 0.4, true)
      this.text.x = width * 0.5
      this.text.y = height * 0.3

      this.swipeContainer.alignTo(this.text, Phaser.BOTTOM_CENTER, 0, height * 0.1)
    }
  }

  resize () {
    this.resizeTutor()
  }

  _handleMove (pointer) {
    if (this.lastPointerPosition) {
      let diffY = this.lastPointerPosition.y - pointer.y
      let targetAngle = this.arm.angle - diffY * 0.2 * this.data.rotate
      if (targetAngle > this.maxArmAngle) {
        targetAngle = this.maxArmAngle
      } else if (targetAngle < this.minArmAngle) {
        targetAngle = this.minArmAngle
      }

      this.arm.angle = targetAngle
    }
    this.lastPointerPosition = new Phaser.Point(pointer.x, pointer.y)
  }

  updateFiringLine() {
    this.firingLine.fromAngle(this._rotatedPoint.x, this._rotatedPoint.y, this.arm.rotation, this.game.world.width)
  }

  calculateRotatedPoint () {
    const trackedSprite = this.weapon.trackedSprite
    const trackOffset = this.weapon.trackOffset
    this._rotatedPoint.set(trackedSprite.world.x + trackOffset.x, trackedSprite.world.y + trackOffset.y)
    this._rotatedPoint.rotate(trackedSprite.world.x, trackedSprite.world.y, trackedSprite.worldRotation)
  }

  static get LEFT() {
    return LEFT
  }

  static get RIGHT() {
    return RIGHT
  }

  update () {
    const bullet = this.bullet
    if (bullet && bullet.alive) {
      this.game.debug.spriteInfo(bullet, 20, 20)
      if (bullet.prevPosition) {
        let rotation = this.game.physics.arcade.angleBetween(bullet.prevPosition, bullet.position)
        bullet.rotation = rotation
      }
      bullet.prevPosition = bullet.position.clone()

      if (this.emitter) {
        this.emitter.x = bullet.x
        this.emitter.y = bullet.y
      }
    }

    this.calculateRotatedPoint()
    this.updateFiringLine()

    this.firingTargetPoint = null
    this.helperLines.forEach(line => {
      if (this.firingTargetPoint) {
        return
      }
      this.firingTargetPoint = Phaser.Line.intersects(this.firingLine, line)
    })

    if (this.firingTargetPoint) {
      this.firingTarget.position.copyFrom(this.firingTargetPoint)
      this.firingTarget.visible = true
    } else {
      this.firingTarget.visible = false
    }
  }

  render() {
    this.firingLineG.clear()
    this.firingLineG.lineStyle(1, 0xDD0000)
    this.firingLineG.moveTo(this.firingLine.start.x, this.firingLine.start.y)
    this.firingLineG.lineTo(this.firingLine.end.x, this.firingLine.end.y)
  }
}