/* globals __DEV__, FbPlayableAd */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    game.stage.disableVisibilityChange = true
  }
  preload () { }

  create (game) {
  }

  update () {
  }

  render() {
    if (__DEV__) {
      // dev logs
    }
  }
}
