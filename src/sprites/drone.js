import Sprite from "./sprite.js";

export default class Drone extends Sprite {
  constructor(pos, game) {
    const frames = [21];
    super(pos, vec2(1), tile(frames[0], 8));
    this.frames = frames;

    this.g = game;
    this.level = game.level;

    this.health = 1;
    this.setCollision();
    this.isBaddie = true;
    this.hit = false;

    this.anims = {
      default: { frames: [21], speed: 0.5 },
      angry: { frames: [21], speed: 0.5 }
    }
    this.changeAnim('default')
    this.angry = false;

    this.mirror = this.getPosFromXCenter() < 0;
    this.velocity = vec2(0.05 * (this.mirror ? 1 : -1), 0);
    this.gravityScale = 0;

  }

  update() {
    super.update();

    if (this.sideTile || this.pos.x < 10 || this.pos.x > 45) {
      this.flipX();
    }

    if (Math.random() > this.health) {
      this.particles.damage(this.pos, this.size);
    }

    if (Math.random() > this.health) {
      this.particles.gunsmoke(this.pos, this.mirror, this.size);
    }
  }

  collideWithObject(o) {
    this.angry = true;
    this.pos.x += o.velocity.x / 3;
    this.velocity.x *= 2;
    if (o.velocity.x > 0 && this.mirror) {
      this.flipX();
    }
    this.health -= 0.34;
    if (this.health > 0) { return; }


    this.particles.explode(this.pos, this.size);
    this.destroy();
    this.makeDebris(this.pos, 'white', 5, .3, 0, 1);
    this.g.sfx.play('explosion', this.pos);
    this.g.achieved.kills.push(this.type);

    }

}
