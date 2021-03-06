/* globals __DEV__, FbPlayableAd */
import Player from '../sprites/Player'
import Enemy  from '../sprites/Enemy'

const mapsData = {
  'map-1': {
    direction: Player.RIGHT,
    finish   : false,
    next     : 'map-2',
    showTutor: true,
  },
  'map-2': {
    direction: Player.LEFT,
    finish   : true,
    next     : null,
    showTutor: false
  }
}

const MAP_BOTTOM_OFFSET = 64 * 13

export default class extends Phaser.State {
  init (mapName) {
    this.mapName = mapName || 'map-1'
    this.mapData = mapsData[mapName]
    game.stage.disableVisibilityChange = true
  }
  preload () { }

  create (game) {
    const {camera, scale, width, height} = game

    this.back = game.add.image(0, 0, 'back')
    
    const enemy  = new Enemy(game)
    game.physics.arcade.enable(enemy)
    enemy.body.immovable = true
    this.enemy = enemy

    const map = game.add.tilemap(this.mapName)
    map.addTilesetImage('tiles')

    const ground = map.createLayer('ground')
    ground.resizeWorld()
    this.ground = ground
    // this.ground.debug = true
    map.setCollisionByExclusion([])

    map.objects.points.forEach(object => {
      if (object.hasOwnProperty('name') && object.name === 'player') {
        this.player = new Player(game, object.x, object.y, this.mapData.direction, this.mapData.showTutor)
      }
      if (object.hasOwnProperty('name') && object.name === 'enemy') {
        enemy.left = object.x
        enemy.top = object.y
        game.world.add(enemy)
      }
      if (object.hasOwnProperty('name') && object.name === 'camera') {
        this.cameraPos = new Phaser.Point(object.x, object.y)
      }
    })

    const helperLines = {
      'a': [],
      'b': [],
      'c': []
    }
    if (map.objects.lines) {
      map.objects.lines.forEach(linePoint => {
        if (linePoint.hasOwnProperty('name')) {
          helperLines[linePoint.name].push({
            x: linePoint.x,
            y: linePoint.y
          })
        }
      })
    }
    this.player.addHelperLines(helperLines)

    this.resize()
  }

  showResult() {
    const {game} = this
    this.resulted = true
    this.resultContainer = game.add.group(game.stage, 'Result Container')

    this.overlay = game.make.graphics()
    this.overlay.beginFill(0x00000)
    this.overlay.drawRect(0, 0, game.width, game.height)
    this.resultContainer.add(this.overlay)
    this.overlay.alpha = 0.9

    this.logo = game.make.image(0, 0, 'logo')
    this.logo.anchor.set(0.5, 0)
    this.resultContainer.add(this.logo)
    
    this.title = game.make.image(0, 0, 'title')
    this.title.anchor.set(0.5, 0)
    this.resultContainer.add(this.title)

    const _ctaBtn = game.make.image(0, 0, 'btn')
    const _ctaText = game.make.text(_ctaBtn.width / 2, _ctaBtn.height / 2 + 5, 'NEXT LEVEL', {
      font: 'notosans',
      fontSize: 25,
      fill: '#ffffff'
    })
    _ctaText.resolution = 2
    _ctaText.anchor.set(0.5)
    _ctaBtn.addChild(_ctaText)

    this.ctaContainer = game.make.group(this.resultContainer, 'cta')
    this.ctaBtn = game.make.sprite(0, 0, _ctaBtn.generateTexture())
    _ctaBtn.destroy()
    this.ctaBtn.anchor.set(0.5)
    this.ctaContainer.add(this.ctaBtn)
    this.ctaBtn.inputEnabled = true
    this.ctaBtn.events.onInputDown.add(this.action, this)

    this.resizeResult()

    const showTween = game.add.tween(this.ctaBtn.scale)
      .from({x: 0, y: 0})
      .easing(Phaser.Easing.Bounce.Out)
      .start()

    showTween.onComplete.add(() => {
      game.make.tween(this.ctaBtn.scale)
        .to({x: 1.2, y: 1.2})
        .yoyo(true)
        .repeat(-1)
        .start()
    })

    game.add.tween(this.resultContainer)
      .from({alpha: 0})
      .start()
  }

  action () {
    if (window.mraid) {
      mraid.open()
    }
  }

  finishGame () {
    this.player.disable()

    this.showResult()
  }

  levelComplete () {
    if (!this.mapData.finish) {
      this.player.disable()
      setTimeout(() => {
        this.state.start('Game', true, false, this.mapData.next)
      }, Phaser.Timer.SECOND * 1)
    } else {
      this.finishGame()
    }
  }
  

  resize (width, height) {
    if (width === undefined) {
      width = game.width
    }
    if (height === undefined) {
      height = game.height
    }

    const {scale, camera, world} = this.game

    this.ground.resize(width, height)

    camera.focusOnXY(this.cameraPos.x, this.cameraPos.y)

    scale.scaleSprite(this.back, camera.view.width + 2, camera.view.height + 2, false)
    this.back.centerX = camera.view.centerX
    this.back.bottom = world.height - MAP_BOTTOM_OFFSET

    if (this.resulted) {
      this.resizeResult()
    }

    if (this.player) {
      this.player.resize()
    }
  }

  resizeResult() {
    const {scale, camera, world, width, height} = this.game

    this.overlay.width = width
    this.overlay.height = height

    scale.scaleSprite(this.logo, width * 0.5, height * 0.3, true)
    this.logo.position.set(width * 0.5, height * 0.1)

    scale.scaleSprite(this.title, width * 0.6, height * 0.1, true)
    this.title.alignTo(this.logo, Phaser.BOTTOM_CENTER, 0, height * 0.05)

    scale.scaleSprite(this.ctaContainer, width * 0.6, height * 0.2, true)
    this.ctaContainer.position.set(width * 0.5, height * 0.8)
  }

  update () {
    game.physics.arcade.collide(this.player.weapon.bullets, this.ground)
    game.physics.arcade.collide(this.player.weapon.bullets, this.enemy, (enemy, bullet) => {
      bullet.kill()

      enemy.die()

      this.levelComplete()
    })

    if (this.player) {
      this.player.update()
    }
  }

  render() {
    if (__DEV__) {
      // dev logs
    }

    if (this.player) {
      this.player.render()
    }
  }
}
