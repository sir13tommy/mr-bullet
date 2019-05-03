import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

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
    this.load.image('logo', require('../../assets/images/logo.png'))
    this.load.image('title', require('../../assets/images/title.png'))
    this.load.image('btn', require('../../assets/images/btn.png'))
    this.load.image('hand', require('../../assets/images/hand.png'))
    this.load.image('target', require('../../assets/images/target.png'))

    this.load.tilemap('map-1', null, require('../../assets/images/map-1.json'), Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('map-2', null, require('../../assets/images/map-2.json'), Phaser.Tilemap.TILED_JSON)
  }

  create () {
    this.state.start('Game', true, false, 'map-1')
  }
}
