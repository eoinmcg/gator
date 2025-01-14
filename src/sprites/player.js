import Sprite from "./sprite.js";
import Lazer from "./lazer.js";
import palette from "../data/palette.js";
import mapTileIs from "../helpers/mapTileIs.js";
import Speech from "./speech.js";

export default class Player extends Sprite {
  constructor(pos, game) {
    super(pos, vec2(1), tile(1, 8));

    this.g = game;
    this.level = game.level;

    this.anims = {
      idle: { frames: [2,2,2,2,2,2,2,2,2,2,7], speed: 0.2 },
      run: { frames: [2,3,4,5,6], speed: 0.05 },
      victory: { frames: [8,8,8,8,9], speed: 0.7 },
    }
    this.changeAnim('idle');
    this.collideTiles = true;

    this.objects = {
      flame: { frame: [17,18], offset: vec2(0.5, -0.8) },
      jetpack: { frame: 16, offset: vec2(0.4, -0.1) },
      gun: { frame: 19, scale: 1, offset: vec2(-0.5, -0.4) },
    }

    this.elasticity = .2;
    this.setCollision(true, true);

    this.jetpackEnergyMax = 1;
    this.jetpackEnergy = this.jetpackEnergyMax;

    this.boost = false;
    this.shotDelay = .1;
    this.shootTimer = new Timer();
    this.shootTimer.set(this.shotDelay);
    this.shots = 0;

    this.hurtTimerVal = 1.2;
    this.startPos = pos.copy();

    this.keys = 0;

    this.mirror = this.getPosFromXCenter() < 0;
    this.lavaSwim = false;


  }

  update() {

    if (this.dead) {
      super.update();
      this.tileInfo.pos.x = 7 * 8;
      this.angle = -1.6 * (this.mirror ? -1 : 1);
      this.additiveColor = undefined;
      return;
    }

    if (this.boat && this.boat.isExiting) {
      this.pos.x += this.boat.move;
      this.pos.y = this.boat.pos.y + 1;
      this.changeAnim('victory');
      return;
    }

    if (this.g.levelComplete) {
      super.update();
      return;
    }

    this.move = isUsingGamepad ? gamepadStick(0) :
        vec2(keyIsDown('ArrowRight') - keyIsDown('ArrowLeft'),
        0);
    this.move.x *= .15;
    this.move.y *= .15;
    this.move.y = 0;
    this.inBoat = false;


    if (this.move.x !== 0 && !this.boost) {
      this.changeAnim('run');
    } else {
      this.changeAnim('idle');
    }

    if (this.move.x) {
      this.mirror = this.move.x < 0;
    }

    this.handleShoot();
    this.handleMapCollision();

    this.pos = this.pos.add(this.move);
    this.pos.x = clamp(this.pos.x, -2, this.level[0].length + 5);
    // this.velocity.y = clamp(this.velocity.y, -0.6, 0.2);
    this.velocity.y = clamp(this.velocity.y, -0.44, 0.22);

    super.update();
    this.handleBoost();

  }

  handleShoot() {
    // this.shoot  = keyIsDown('Space') || keyIsDown('KeyX') || gamepadIsDown(2);
    this.shoot  = keyWasPressed('Space') || keyWasPressed('KeyX') || gamepadWasPressed(2);
    // if (this.shoot && this.shootTimer.elapsed() && this.g.ammo > 0) {
    // if (this.shoot && this.shootTimer.elapsed()) {
    if (this.shoot) {
      this.g.ammo -= 1;
      this.shots += 1;
      new Lazer(this.pos, this.mirror, this.g);
    } else {
      this.shoot = false;
    }
    if (this.shootTimer.elapsed()) {
      this.shootTimer.set(this.shotDelay);
    }
  }

  handleBoost() {
    this.boost  = keyIsDown('KeyZ') || keyIsDown('ArrowUp') || gamepadIsDown(0) || gamepadIsDown(1);
    if (this.boost && this.jetpackEnergy > 0) {
      if (this.velocity.y < 0) this.velocity.y = 0;
      this.velocity.y += 0.02;
      this.jetPackExhaust();
      this.g.sfx.play('jet', this.pos);
      this.jetpackEnergy -= this.deltaTime / 3;
    } else if (this.onGround || this.inBoat) {
      this.jetpackEnergy += this.deltaTime;
    }
    if (this.jetpackEnergy < 0) this.jetpackEnergy = 0;
    if (this.jetpackEnergy > this.jetpackEnergyMax) {
      this.jetpackEnergy = this.jetpackEnergyMax;
    }

  }

  handleMapCollision() {

    this.belowTile = this.getMapTile(vec2(0,-0.6));
    this.wasOnGround = this.onGround;

    if (mapTileIs('fire', this.belowTile) && !this.hurt) {
      this.particles.sparks(this.pos);
      this.loseLife(true);
      if (!this.lavaSwim) {
        this.lavaSwim = true;
        this.g.medals[5].unlock();
      }
    }

    if (mapTileIs('water', this.belowTile)) {
      let pos = this.pos.copy();
      this.pos.y = 1.5;
      if (pos.x !== this.lastPos.x) {
        this.particles.splash(pos.add(vec2(0,-1)));
      }
    }

    if (this.belowTile !== 0 && !this.wasOnGround) {
      this.bounce(this.belowTile);
    }
    this.onGround = this.belowTile !== 0 || this.velocity.y.toFixed(4) === '0.0017';

    // edge case stop player falling thru
    if (this.belowTile && this.velocity.y < -0.1 && this.move.x) {
      this.pos.y += 0.5;
    }

    let offsetX = (this.mirror) ? -0.7 : 0.7;
    this.sideTile = this.getMapTile(vec2(offsetX,0));
    if (mapTileIs('solid', this.sideTile)) {
      this.move.x = 0;
      this.velocity.x = 0;
    }


    if (mapTileIs('door', this.sideTile)) {
      if (this.keys > 0) {
        this.openDoor(this.pos.add(vec2(offsetX, 0)));
      } else {
        const t = [`IT'S LOCKED`, 'FIND A KEY'];
        this.speech = (!this.speech || this.speech?.ttl < 0)
          ? new Speech(this, t.rnd())
          : this.speech;
      }
    }

    this.aboveTile = this.getMapTile(vec2(0,.9));
    let aboveTileL = this.getMapTile(vec2(-0.5,.9)),
        aboveTileR = this.getMapTile(vec2(0.5,.9));
    if (mapTileIs('passable', this.aboveTile)
        || mapTileIs('passable', aboveTileL)
        || mapTileIs('passable', aboveTileR)) {
      this.collideTiles = false;
    } else {
      this.collideTiles = true;
    }

    // bump of ceiling to prevent passing thru
    if (this.collideTiles && this.aboveTile && this.velocity.y > 0.2) {
      this.move.y = -0.1;
      this.velocity.y *= -0.2;
    }

    this.debugTiles = {
      below: vec2(0, -1),
      above: vec2(0, 1),
      side: vec2(offsetX, 0)
    }

    // return true;
  }

  render() {
    super.render();
    if (!this.dead) {
      this.drawObjects();
    }

    // let p = this.pos.copy();
    // let side = p.add(this.debugTiles.side);
    // let below = p.add(this.debugTiles.below);
    // let above = p.add(this.debugTiles.above);
    //
    // drawRect(side, vec2(1), palette.white.mk(.2));
    // drawText(this.sideTile, side);
    // drawRect(below, vec2(1), palette.white.mk(.2));
    // drawText(this.belowTile, below);
    // drawRect(above, vec2(1), palette.white.mk(.2));
    // drawText(this.aboveTile, above);
    // drawText(this.onGround, above.add(vec2(1.3,0)));

  }


  drawObjects() {
    Object.keys(this.objects).forEach((n) => {
      let object = this.objects[n];
      let currentFrame = (typeof object.frame === 'number')
       ? object.frame
      : object.frame[Math.floor(Math.random() * object.frame.length)];
      let x = (this.mirror)
        ? object.offset.x : -object.offset.x;

      let scale = object?.scale || 1;
      let angle = this.angle;

      if (n === 'flame' && (!this.boost || this.jetpackEnergy === 0)) {

      } else {
        drawTile(
          vec2(this.pos.x + x,
            this.pos.y + object.offset.y),
          vec2(scale),
          tile(currentFrame, vec2(8,8)),
          new Color(255,255,255,1),
          angle,
          this.mirror
        );
      }
    })
  }

  jetPackExhaust() {
    this.particles.jetpack(this.pos, this.mirror);

  }

  bounce(tile) {
    if (time - this.lastBounce < .5) return;
    if (tile === 37) {
      this.particles.splash(this.pos.add(vec2(0,-1)));
      this.g.sfx.play('splash', this.pos);
    } else {
      this.g.sfx.play('bounce', this.pos);
      this.particles.bounce(this.pos, this.size);
    }
    this.lastBounce = time;
  }

  collideWithObject(o) {

    if (o.constructor.name === 'Animal') {
      return;
    }

    this.inBoat = false;
    if (o.constructor.name === 'Boat') {
      this.inBoat = true;
      this.boat = o;
      this.velocity.y = 0;
      this.pos.y = o.pos.y + (o.mirror ? -1 : 1);
    }

    if (o.isBaddie && !this.hurt) {
      this.loseLife();
      o.collideWithObject(this);
    }
  }

  loseLife(fire = false) {
    if (this.dead) return;
    this.g.lives -= 1;
    this.g.sfx.play('hurt', this.pos);
    this.flash(2, fire ? new Color(1,0,0,0) : false);

    if (this.g.lives < 0) {
      this.dead = true;
    }
  }

  destroy() {
    super.destroy();
  }

  openDoor(pos) {
    this.g.sfx.play('open', this.pos);
    this.keys -= 1;
    this.removeTile(pos);
    pos = pos.add(vec2(0,1)); // top part of door
    this.removeTile(pos);
  }

}
