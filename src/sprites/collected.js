import Sprite from "./sprite";

export default class Collected extends Sprite {
  constructor(pos, game, val, cb = false) {
    super(pos.add(vec2(0.5,0)), vec2(1), tile(val, 8));
    this.g = game;
    this.anims = {
      idle: { frames: [val], speed: 0.1 },
    }
    this.velocity = vec2(-0.4, 0.3);
    this.startPos = pos.copy();
    this.range = 20;
    this.setCollision(false, false, false, false);
    this.gravityScale = 0;
    this.cb = cb;
  }

  update() {
    super.update();
    if (this.pos.distance(this.startPos) > this.range) {
      this.cb();
      this.destroy();
    }

  }
}
