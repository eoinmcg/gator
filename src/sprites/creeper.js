import Sprite from "./sprite.js";
import palette from "../data/palette.js";


export default class Creeper extends Sprite {
  constructor(pos, game) {
    const frames = [22,23];
    super(pos, vec2(1), tile(frames[0], 8));
    this.frames = frames;
    this.frame = 6

    this.g = game;
    this.level = game.level;

    this.health = 1;
    this.setCollision();
    this.collideTiles = true;
    this.isBaddie = true;
    this.hit = false;

    this.anims = {
      idle: { frames: [22], speed: 0 },
      run: { frames: [22, 23], speed: 0.1 }
    }
    this.changeAnim('idle')


    this.mirror = false;
    this.fieldOfVision;
    this.seesPlayer = false;
    this.vx = 0.1;
    this.velocity = vec2(0,0);

  }

  update() {

    this.dist = 8 * (this.mirror ? -1 : 1);
    this.fieldOfVision = this.pos.add(vec2(this.dist, 0));
    const seesPlayer = engineObjectsRaycast(this.pos, this.fieldOfVision)
    .includes(this.g.p1);

    if (seesPlayer && !this.seesPlayer) {
      this.seesPlayer = true;
      this.changeAnim('run');
    } 

    if (this.seesPlayer) {
      this.velocity.x = this.vx * (this.mirror ? -1 : 1);
    }

    if (this.bottomTile === 0 || this.sideTile !== 0) {
      this.velocity.x *= -1;
      this.mirror = !this.mirror;
    }

    if (Math.random() > this.health) {
      this.particles.damage(this.pos, this.size);
    }

    if (Math.random() > this.health) {
      this.particles.gunsmoke(this.pos, this.mirror, this.size);
    }

    super.update();
  }

  render() {
    super.render();
    // drawLine(this.pos, this.fieldOfVision, .1, this.g.palette.pink.mk(.5));
  }

  collideWithObject(o) {
    const name = o.constructor.name;
    if (name === 'Player') {
      this.destroy();
    }
  }

  takeDamage(o) {
    this.health -= .25;
    this.seesPlayer = true;
    this.changeAnim('run');
    this.mirror = o.pos.x < this.pos.x;

    if (this.health > 0) { return; }

    this.destroy();
  }

  destroy() {
    super.destroy();
    this.particles.explode(this.pos, this.size);
    this.makeDebris(this.pos, 'white', 5, .3, 0, 1);
    this.g.sfx.play('explosion', this.pos);
    this.g.achieved.kills.push(this.type);

  }

}
