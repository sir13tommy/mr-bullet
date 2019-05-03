import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'

import './fonts.css'
import config from './config'

window.PhaserGlobal = {
  disableWebAudio: true
};

window.Phaser = Phaser

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super({
      width: width,
      height: height,
      renderer: Phaser.AUTO,
      scaleMode: Phaser.ScaleManager.SHOW_ALL
    })

    this._addListeners()

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    this.state.start('Boot')
  }

  _addListeners() {
    window.addEventListener('resize', () => {
      const game = this
      if (game && game.isBooted) {
        const currentState = game.state.getCurrentState()
        const docElement = document.documentElement
        const width = docElement.clientWidth > window.innerWidth ? window.innerWidth : docElement.clientWidth
        const height = docElement.clientHeight > window.innerHeight ? window.innerHeight : docElement.clientHeight
        
        game.scale.setGameSize(width, height)
        if (currentState && currentState.resize) {
          currentState.resize(width, height)
        }
      }
    })
  }
}

window.game = new Game()