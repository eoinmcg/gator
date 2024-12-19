import Sprite from "./sprite";
import mapTileIs from "../helpers/mapTileIs";

export default class Turret extends Sprite {

  constructor(pos, game, val) {
    val = val - 257;
    // val = 24;
    pos = pos.add(vec2(.5, 0));
    super(pos, vec2(1), tile(val, 8));
    this.frame = val;

    this.dirs = {
      29: vec2(1,-1),
      28: vec2(0,-1),
      27: vec2(-1,-1),
      26: vec2(-1,0),
      25: vec2(1,0),
    }

    this.g = game;
    this.level = game.level;

    this.gravityScale = 0;

    this.setCollision();
    this.collideTiles = true;
    this.isBaddie = true;

    this.normalTile = this.tileInfo.pos.y;
    this.recoilTile = this.tileInfo.pos.y + 8;

    this.fieldOfVision = this.pos.copy();
    this.range = 10;
    let a = this.dirs[this.frame];
    this.fieldOfVision = this.fieldOfVision.add(vec2(a.x * this.range, a.y * this.range));

    this.seeTime = 0;
    this.seesPlayer = false;
    this.sawPlayer = false;

    this.lazer = false;
  }

  update() {

     this.seesPlayer = engineObjectsRaycast(this.pos, this.fieldOfVision)
      .includes(this.g.p1);

    if (this.seesPlayer) {
      this.seeTime += 0.01;
      this.seeTime = clamp(this.seeTime, 0.25, 0.95);
      this.tileInfo.pos.y = this.normalTile;
    } else {
      this.seeTime = 0;
      this.tileInfo.pos.y = this.recoilTile;
    }

    if (this.seeTime > 0.5 && (!this.lazer || this.lazer?.destroyed)) {
      this.lazer = new EnemyLazer(this.pos, this.g, this.dirs[this.frame], this.range);
      this.tileInfo.pos.y = this.recoilTile;
    }

    if (this.seesPlayer && !this.sawPlayer) {
      this.g.sfx.play('spotted');
    }

    this.sawPlayer = this.seesPlayer;

  }

  render() {
    super.render();
    if (this.seesPlayer) {
      drawLine(this.pos, this.g.p1.pos, .1, this.g.palette.red.mk(this.seeTime));
    }
  }

  collideWithObject(o) {
    let name = o.constructor.name;
    if (name === 'Animal') { return; }
    if (name === 'Player') { this.destroy(); }
  }

  destroy() {
    this.particles.explode(this.pos, this.size);
    this.makeDebris(this.pos, 'white', 5, .3, 0, 1);
    this.g.sfx.play('explosion', this.pos);
    this.g.achieved.kills.push(this.type);
    super.destroy();
  }

}

class EnemyLazer extends Sprite {
  constructor(pos, game, vel, range) {
    pos.add(vec2(vel.x), -1);
    super(pos, vec2(1), tile(31, 8));
    this.g = game;
    this.level = game.level;
    this.isBaddie = true;

    this.g.sfx.play('turret', this.pos);
    this.collideTiles = true;
    this.setCollision(true, false, false, false);
    this.gravityScale = 0;

    let v = 5;
    this.velocity = vec2(vel.x / v, vel.y / v);
    this.angle = Math.atan2(vel.x, vel.y);
    this.startPos = this.pos.copy();
    this.range = range * 3;

    this.t = 0;

  }

  update() {
    super.update();
    this.t += 1;

    if (this.t === 5) {
      this.particles.turretsmoke(this.pos)
    }

    this.tile = this.getMapTile();
    if (mapTileIs('solid', this.tile, .5)
    || this.pos.distance(this.startPos) > this.range) {
      this.particles.gunhit(this.pos, this.g.palette.red.col);
      this.destroy();
    }
  }

  collideWithObject(o) {
    if (o.isBaddie) { return; }
    if (o.constructor.name === 'Player') {
      this.particles.gunhit(this.pos, this.g.palette.red.col);
      this.destroy();
    }
  }
}
