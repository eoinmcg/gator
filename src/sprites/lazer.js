import Sprite from "./sprite.js";
import mapTileIs from "../helpers/mapTileIs.js";

export default class Lazer extends Sprite {
  constructor(pos, mirror, game) {
    let offsetX = (mirror) ? -0.5 : 0.5;
    super(vec2(pos.x + offsetX, pos.y - 0.5), vec2(1), tile(32, 8));
    this.mirror = mirror;

    this.setCollision(true, false, false, false);
    this.g = game;
    this.level = game.level;

    this.g.sfx.play('shoot', this.pos);

    this.particles.gunsmoke(this.pos, mirror, this.size);

    this.angle = rand(0.00,0.1)
    this.gravityScale = 0;
    this.velocity = vec2(5 * (mirror ? -1 : 1), this.angle);
    this.startPos = this.pos.copy();
    this.range = 20;
  }

  update() {

    if (this.pos.distance(this.startPos) > this.range
      || mapTileIs('solid', this.sideTile)) {
      this.destroy(); return;
    }

    let pos = this.pos.copy();
    this.checkGlass(pos);
    this.checkGlass(pos.add(vec2(0,1)));
    this.checkGlass(pos.add(vec2(0,-1)));

    super.update();
  }

  checkGlass(pos, destroy = true) {
    pos = pos.add(vec2(0.9 * (this.mirror ? -1 : 1), 0));
    let x = ~~(pos.x), y = ~~(pos.y);

    if (y < 0 || x < 0 || y >= this.level.length || x >= this.level[0].length ) {
      return;
    }

    let tileInfo = this.level[y][x];

    if (mapTileIs('glass', tileInfo)) {
        this.destroyGlass(pos);
    } else {
      return;
    }

    if (tileInfo && destroy) {
      this.destroy(true);
      return;
    }

  }

  destroyGlass(pos) {
      pos = pos.floor();

      // destroy tile
      const tileType = getTileCollisionData(pos);
      if (!tileType) { return; }

      const layerData = this.g.tileLayer.getData(pos);
      if (layerData && layerData.tile !== 0) {
          this.makeDebris(pos, 'sky');
          this.g.sfx.play('smash', pos);
          this.removeTile(pos);
      }
  }

  collideWithObject(o) {
    this.g.score += 1;

    if (o.constructor.name === 'Boat') { return; }
    if (o.constructor.name === 'Lazer') { return; }
    if (o.constructor.name === 'Animal') { return; }
    if (o.constructor.name === 'Player') { return; }

    if (o.constructor.name === 'Turret') {
      o.destroy();
    }
    if (o.constructor.name === 'Drone' && !o.angry) {
      o.flash();
    }
    if (o.constructor.name === 'Creeper') {
      o.flash();
      o.takeDamage(this);
      if (!o.seesPlayer) { o.mirror = !o.mirror; }
    }

    this.destroy(true);
  }

  destroy(explode = true) {

    super.destroy();
    if (!explode) return;
    this.particles.gunhit(this.pos);
  }
}
