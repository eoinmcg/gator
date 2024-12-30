import Sprite from "./sprite";
import Speech from "./speech.js";

export default class Donut extends Sprite {
  constructor(pos, game) {
    super(pos.add(vec2(0.5,0)), vec2(1), tile(78, 8));
    this.g = game;
    this.level = game.level;

    this.anims = {
      idle: { frames: [100], speed: 0.1 },
    }
    this.changeAnim('idle')
    this.collideTiles = true;
    this.setCollision();
  }

  collideWithObject(o) {
    if (o.constructor.name === 'Player') {
      this.g.sfx.play('key', this.pos);
      this.destroy();
      new Speech(this, 'DELICIOUS');
      if (this.g.levelNum === 5) {
        this.g.medals[6].unlock();
      }
    }
  }

}

