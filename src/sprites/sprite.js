import Particles from "../helpers/particles";

export default class Sprite extends EngineObject {
  constructor(pos, size, tileInfo) {
    super(pos, size, tileInfo);
    this.currentAnim = false;
    this.anims = {};
    this.frameCurrent = 0;
    this.frameCounter = 0;

    this.tick = 0;
    this.lastTick = 0;
    this.deltaTime = 0;

    this.type = this.constructor.name;
    this.particles = Particles;

    this.hurt = false;
    this.hurtTimer = new Timer();
    this.hurtTimerVal = 0.5;
    this.mirror = this.velocity.x > 0;

    this.lastPos = this.pos;
    this.lastVel = this.velocity;

    this.dead = false;
  }

  update() {
    this.tick = window.performance.now();
    this.deltaTime = (this.tick - this.lastTick) / 1000;


    if (this.hurt && this.hurtTimer.elapsed()) {
      this.hurt = false;
      this.additiveColor = undefined;
    }

    if (this.currentAnim) {
      this.runAnim();
    }

    // this.sideTilePos = vec2(this.velocity.x < 0 ? -.9 : .9, 0);
    this.sideTilePos = vec2(this.mirror ? -.9 : .9, 0);
    this.bottomTilePos = vec2(this.velocity.x < 0 ? -.9 : .9,-.9);
    this.sideTile = this.getMapTile(this.sideTilePos);
    this.bottomTile = this.getMapTile(this.bottomTilePos);
    this.lastTick = this.tick;

    super.update();
    this.lastPos = this.pos.copy();
  }

  runAnim() {
    this.frameCounter += this.deltaTime;

    if (this.frameCounter >= this.currentAnim.speed) {
        this.frameCounter = 0;
        this.frameCurrent = (this.frameCurrent + 1)
          % this.currentAnim.frames.length;
        this.tileInfo.pos.x = this.currentAnim.frames[this.frameCurrent] * 8;
    }
  }

  changeAnim(name) {
    if (this.currentAnim === this.anims[name]) { return ; }
    this.currentAnim = this.anims[name];
    this.frameCounter = this.currentAnim.speed;
  }

  flipX() {
      this.velocity.x *= -1
      this.mirror = this.velocity.x > 0;
  }

  flash(time, col = false) {
    col = col || new Color(1,1,1,0);
    time = time || this.hurtTimerVal
    this.additiveColor = col;
    this.hurt = true;
    this.hurtTimer.set(time);
  }

  getPosFromXCenter() {
    return (this.level[0].length / 2) - this.pos.x;
  }

  getMapTile(offset = vec2(0)) {
    let tileNum = 0;
    let pos = this.pos.copy().add(offset)
    let isColliding = tileCollisionTest(pos, this.size, this);
    if (isColliding) {
      let x = ~~(pos.x),
          y = ~~(pos.y);
      try {
        tileNum = parseInt(this.level[~~y][~~x], 10);
      } catch (e) {
        // console.log('ERROR!: ', e, x, y);
      }
    }
    return tileNum;
  }

  removeTile(pos) {
    pos = pos.floor();
    setTileCollisionData(pos, 0);
    this.g.tileLayer.setData(pos, new TileLayerData, 1);
    this.g.level[pos.y][pos.x] = 0;
  }

  makeDebris(pos, color = 'white', amount = 100, size=.2, elasticity = .3, time = 3, tileNo = 1) {
      color = this.g.palette[color].col;
      const color2 = color.lerp(new Color, .5);
      const emitter = new ParticleEmitter(
          pos, 0, 1, .1, 100, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
          tile(tileNo,8),                      // tileInfo
          color, color2,          // colorStartA, colorStartB
          color, color2,          // colorEndA, colorEndB
          time, size,size, .1, .05,  // time, sizeStart, sizeEnd, speed, angleSpeed
          1, .95, .4, PI, 0,      // damp, angleDamp, gravity, particleCone, fade
          .5, 1                   // randomness, collide, additive, colorLinear, renderOrder
      );
      emitter.elasticity = elasticity;
      return emitter;
  }

}
