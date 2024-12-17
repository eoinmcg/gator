import Sprite from "./sprite";
import Key from "./key";

export default class Breakable extends Sprite {

  constructor(pos, game, val) {
    if (val > 256) { val -= 256; val -= 1; }
    let key = val === 100;
    if (key) { val = 96; }
    
    super(pos.add(vec2(0.5,0)), vec2(1), tile(val, 8));

    this.key = key;

    this.g = game;
    this.level = game.level;

    this.anims = {
      idle: { frames: [val], speed: 0.1 },
    }
    this.changeAnim('idle')
    this.collideTiles = true;
    this.setCollision();
  }

  collideWithObject(o) {
    if (o.constructor.name === 'Lazer') {
      this.makeDebris(this.pos, 'black', 3, .5, .5, 1, 38);
      this.g.sfx.play('smash', this.pos);
      this.destroy();
      if (this.key) {
        new Key(this.pos.add(vec2(-.5, 0)), this.g);
      }
    }
  }
}
