import Sprite from "./sprite";

export default class Help extends Sprite {
  constructor(pos, game, text = false) {
    super(pos, vec2(1), tile(39, 8));

    this.g = game;
    this.level = game.level;

    this.anims = {
      idle: { frames: [40,39], speed: .5 },
    }

    this.changeAnim('idle')
    this.text = text;


    this.mirror = Math.random() > .5;
    this.ttl = 1;
    this.gravityScale = 0;

  }

  update() {
    this.pos.y += 0.005;
    this.ttl -= 0.01

    if (this.ttl <= 0) {
      this.destroy();
    }
    super.update();
  }
}
