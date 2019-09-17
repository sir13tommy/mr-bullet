export default class Enemy extends Phaser.Sprite {
  constructor(game) {
    super(game, 0, 0, 'enemy', 'body.png')
    this.anchor.set(0.5)

    // back
    this.legBack = this.game.make.image(-11, 26, 'enemy', 'leg_back.png')
    this.legBack.pivot.set(7, 7)
    this.addChild(this.legBack)

    this.legBackBottom = this.game.make.image(0, 29, 'enemy', 'bottom_leg_back.png')
    this.legBackBottom.pivot.set(7, 0)
    this.legBack.addChild(this.legBackBottom)

    this.armBack = this.game.make.image(-25, -24, 'enemy', 'arm_back.png')
    this.armBack.pivot.set(7, 6)
    this.addChild(this.armBack)

    this.foreArmBack = this.game.make.image(0, 18, 'enemy', 'fore_arm_back.png')
    this.armBack.addChild(this.foreArmBack)

    this.bodyImg = this.game.make.image(0, 0, 'enemy', 'bodyImg.png')
    this.bodyImg.pivot.set(26, 35)
    this.addChild(this.bodyImg)

    this.leg = this.game.make.image(10, 26, 'enemy', 'leg.png')
    this.leg.pivot.set(7, 7)
    this.addChild(this.leg)

    this.legBottom = this.game.make.image(0, 29, 'enemy', 'bottom_leg.png')
    this.legBottom.pivot.set(6, 0)
    this.leg.addChild(this.legBottom)

    this.arm = this.game.make.image(25, -24, 'enemy', 'arm.png')
    this.arm.pivot.set(7, 6)
    this.addChild(this.arm)

    this.foreArm = this.game.make.image(0, 18, 'enemy', 'fore_arm.png')
    this.arm.addChild(this.foreArm)

    // head
    this.head = this.game.make.image(0, -35, 'enemy', 'head.png')
    this.head.pivot.set(23, 41)
    this.addChild(this.head)

    this.phases = {
      1: {
        run: () => {
          let rotating = game.add.tween(this)
            .to({angle: [-10, 95]}, Phaser.Timer.SECOND * 0.6)
            .easing(Phaser.Easing.Cubic.Out)
            .start()

          let legRotation = game.add.tween(this.leg)
            .to({angle: 60}, Phaser.Timer.SECOND * 0.2)
            .start()

          let legBackBottomRotation = game.add.tween(this.legBackBottom)
            .to({angle: [20, -30]}, Phaser.Timer.SECOND * 0.5)
            .start()

          let legBackRotation = game.add.tween(this.legBack)
            .to({angle: 60}, Phaser.Timer.SECOND * 0.2)
            .start()

          let legBottomRotation = game.add.tween(this.legBottom)
            .to({angle: [20, -30]}, Phaser.Timer.SECOND * 0.5)
            .start()

          let falling = game.add.tween(this)
            .to({y: '+4'}, Phaser.Timer.SECOND * 0.1)
            .start()
          let moving = game.add.tween(this)
            .to({x: this.x + 147}, Phaser.Timer.SECOND * 1.3)
            .easing(Phaser.Easing.Exponential.Out)
            .start() 

          let armRotation = game.add.tween(this.arm)
            .to({angle: 60}, Phaser.Timer.SECOND * 0.3)
            .start()

          let armBackRotation = game.add.tween(this.armBack)
            .to({angle: 60}, Phaser.Timer.SECOND * 0.1)
            .start()

          return armBackRotation.onComplete
        }
      },
      2: {
        run: () => {
          let falling = game.add.tween(this)
            .to({y: '+43'}, Phaser.Timer.SECOND * 0.3)
            .easing(Phaser.Easing.Cubic.Out)
            .start()

          let legRotation = game.add.tween(this.leg)
            .to({angle: -10}, Phaser.Timer.SECOND * 0.3)
            .delay(Phaser.Timer.SECOND * 0.1)
            .easing(Phaser.Easing.Bounce.Out)
            .start()

          let legBackRotation = game.add.tween(this.legBack)
            .to({angle: -30}, Phaser.Timer.SECOND * 0.3)
            .delay(Phaser.Timer.SECOND * 0.1)
            .easing(Phaser.Easing.Bounce.Out)
            .start()

          let armRotation = game.add.tween(this.arm)
            .to({angle: -5}, Phaser.Timer.SECOND * 0.6)
            .easing(Phaser.Easing.Bounce.Out)
            .start()

          let armBackRotation = game.add.tween(this.armBack)
            .to({angle: -20}, Phaser.Timer.SECOND * 0.6)
            .easing(Phaser.Easing.Bounce.Out)
            .start()
          
          let headRotation = game.add.tween(this.head)
            .to({angle: 8, y: '3'}, Phaser.Timer.SECOND * 0.3)
            .start()
        }
      }
    } 
  }

  die () {
    let completeSignal = this.phases['1'].run()
    completeSignal.addOnce(() => {
      this.phases['2'].run()
    })
  }

  update () {
    // this.game.debug.body(this)
  }
}