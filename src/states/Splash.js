import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import { scaleModes } from 'phaser-ce';

export default class extends Phaser.State {
  init () {}

  preload () {
    this.logo = this.add.image(this.world.centerX, 140, 'logo')
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 40, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 40, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar, this.logo])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('back', require('../../assets/images/back_city.jpg'))
    this.load.image('player', require('../../assets/images/player.png'))
    this.load.image('player_arm', require('../../assets/images/player_arm.png'))
    this.load.image('player_left', require('../../assets/images/player_left.png'))
    this.load.image('player_arm_left', require('../../assets/images/player_arm_left.png'))
    this.load.image('enemy', require('../../assets/images/enemy.png'))
    this.load.image('bullet', require('../../assets/images/bullet.png'))
    this.load.image('tiles', require('../../assets/images/atlas/dist/tiles.png'))
    this.load.image('title', require('../../assets/images/title.png'))
    this.load.image('btn', require('../../assets/images/btn.png'))
    this.load.image('hand', require('../../assets/images/hand.png'))
    this.load.image('target', require('../../assets/images/target.png'))

    // this.load.atlas('enemy', require('../../assets/images/atlas/dist/gangsta.png'), null, require('../../assets/images/atlas/dist/gangsta.json'))

    this.load.tilemap('map-1', null, require('../../assets/images/map-1.json'), Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('map-2', null, require('../../assets/images/map-2.json'), Phaser.Tilemap.TILED_JSON)
  }

  create () {
    this.state.start('Game', true, false, 'map-1')
  }

  resize () {
    const {centerX, centerY} = this.game.world
    this.logo.x = centerX
    this.loaderBg.x = centerX
    this.loaderBar.x = centerX
   }
}
