export default class Enemy extends Phaser.Sprite {
  constructor(game) {
    super(game, 0, 0, 'enemy', 'head.png')

    this.armBack = this.game.make.image(-52 + 43, 0 + 41, 'enemy', 'arm_back.png'),
    this.addChild(this.armBack)

    this.foreArmBack = this.game.make.image(-52 + 43, 25 + 41, 'enemy', 'fore_arm_back.png')
    this.addChild(this.foreArmBack)

    this.bodyImg = this.game.make.image(-47 + 43, 0 + 41, 'enemy', 'body.png')
    this.addChild(this.bodyImg)

    this.arm = this.game.make.image(-2 + 43, 0 + 41, 'enemy', 'arm.png')
    this.addChild(this.arm)

    this.foreArm = this.game.make.image(-2 + 43, 25 + 41, 'enemy', 'fore_arm.png')
    this.addChild(this.foreArm)

    this.legBack = this.game.make.image(-40 + 43, 47 + 41, 'enemy', 'leg_back.png')
    this.addChild(this.legBack)

    this.legBackBottom = this.game.make.image(-47 + 43, 77 + 41, 'enemy', 'bottom_leg_back.png')
    this.addChild(this.legBackBottom)

    this.leg = this.game.make.image(-17 + 43, 47 + 41, 'enemy', 'leg.png')
    this.addChild(this.leg)

    this.legBottom = this.game.make.image(-24 + 43, 77 + 41, 'enemy', 'bottom_leg.png')
    this.addChild(this.legBottom)
  }

  die () {
    game.add.tween(this)
        .to({angle: 90}, Phaser.Timer.SECOND * 0.6)
        .easing(Phaser.Easing.Bounce.Out)
        .start()
  }

  update () {
    this.game.debug.body(this)
  }
}