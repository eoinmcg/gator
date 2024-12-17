import Sprite from "./sprite";
import Collected from "./collected";

export default class Key extends Sprite {


  constructor(pos, game) {
    super(pos.add(vec2(0.5,0)), vec2(1), tile(100, 8));
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
      const cb = () => {
        this.g.p1.keys += 1;
      }
      new Collected(this.pos, this.g, 100, cb);
      this.destroy();
    }
  }

  }
