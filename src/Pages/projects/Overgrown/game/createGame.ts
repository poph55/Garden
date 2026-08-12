import Phaser from 'phaser'
import { GridWorldScene } from './GridWorldScene'

export function createGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 240,
    height: 160,
    backgroundColor: '#1d2b24',
    pixelArt: true,
    antialias: false,
    scene: [GridWorldScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  })
}
