import Sprite from "./sprite.js";
import palette from "../data/palette.js";
import P8 from "../lib/p8.js";


export default class Bug extends Sprite {
  constructor(pos, game) {
    const frames = [80,81];
    super(pos, vec2(1), tile(frames[0], 8));
    this.frames = frames;
    this.frame = 6

    this.g = game;
    this.level = game.level;

    this.health = 3;

    this.elasticity = .2;
    this.setCollision(true, true);
    this.setCollision();
    this.collideTiles = true;


    this.anims = {
      idle: { frames: [80,81], speed: 0.5 },
      fly: { frames: [83,84], speed: 0.05 }
    }
    this.changeAnim('idle')

    this.velocity = vec2(0, 0);
    this.gravityScale = 0;
    this.mirror = this.velocity.x < 0;

    this.vx = 0.02;

  }

  update() {

    console.log('PL?', keyIsDown());
    if (inputJumpHeld()) {
      this.changeAnim('fly');
      this.velocity.y += 0.02;
      this.velocity.x += this.vx;
    } 
    if (inputJumpPressed()) {
      this.mirror = !this.mirror;
      this.vx *= -1;
      
    }
    if (inputJumpReleased()) {
      console.log('RELEASE!');
      this.velocity.y = 0;
      this.velocity.x = 0;
      this.changeAnim('idle');
    }
    
    super.update();
  }

  collideWithObject(o) {
    this.pos.x += o.velocity.x / 3;
    this.health -= 1;
    if (this.health > 0) { return; }

    const color = palette.red2.col;
    const color2 = palette.orange2.col;
      new ParticleEmitter(
          this.pos, 0,            // pos, angle
          this.size, .1, 200, PI, // emitSize, emitTime, emitRate, emiteCone
          tile(0,8),                      // tileInfo
          color, color2,           // colorStartA, colorStartB
          color.scale(1,0), color2.scale(1,0), // colorEndA, colorEndB
          .3, .5, 2.5, .1, .1,  // time, sizeStart, sizeEnd, speed, angleSpeed
          .99, .95, .4, PI,   // damping, angleDamping, gravityScale, cone
          .1, .5, 0, 1        // fadeRate, randomness, collide, additive
      );
      this.destroy();
      this.makeDebris(this.pos, 'pink', 5, .3, 0, 1);
      this.g.sfx.play('explosion', this.pos);
    }

}


function inputJumpHeld() {
	return keyIsDown("Space") || gamepadIsDown(0) || mouseIsDown(0);
}

function inputJumpPressed() {
	return keyWasPressed("Space") || gamepadWasPressed(0) || mouseWasPressed(0);
}

function inputJumpReleased() {
	return keyWasReleased("Space") || gamepadWasReleased(0) || mouseWasReleased(0);
}
