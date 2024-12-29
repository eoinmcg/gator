import Sprite from "./sprite.js";
import Help from "./help.js";
import Speech from "./speech.js";

export default class Animal extends Sprite {

  constructor(pos, game, val) {
    if (val > 256) { val -= 256; val -= 1; }
    // val = 80;
    if (val === 35) {
    val = [80,48,64].rnd();
    }
    // let t = 
    // val = t[~~(Math.random() * t.length)];
    super(pos, vec2(1), tile(val, 8));

    if (val === 64) { this.name = 'Bunny';
    } else if (val === 48) { this.name = 'Parrot';
    } else if (val === 80) { this.name = 'Leopard'; }

    this.g = game;
    this.level = game.level;

    this.anims = {
      idle: { frames: [val, val, val, val, val + 1], speed: 0.1 },
      run: { frames: [val, val + 2], speed: 0.05 }
    }

    this.changeAnim('idle')
    this.collideTiles = true;

    this.elasticity = .2;
    this.setCollision(true);
    this.saved = false;
    this.caged = true;

    this.cryTimer = new Timer();
    this.cryTimer.set(rand(1,5));

    this.followSpeed = rand(0.15, 0.25);
    // this.followSpeed = 0.1;
    this.font = new FontImage;

  }

  update() {
    this.touchingPlayer = false;
    super.update()

    if (this.cryTimer.elapsed() && this.caged) {
      this.cryTimer.set(rand(5, 10));
      if (this.pos.distance(this.g.p1.pos) < 21) {
        // this.g.sfx.play('help', this.pos);
      }
      this.help = new Help(this.pos.add(vec2(0,1)), this.g);
    }

    this.dist = this.pos.distance(this.g.p1.pos);

    if (this.inBoat) {
      this.pos.x = this.inBoat.pos.x + (this.passenger * 0.5) - 1;
      this.pos.y = this.inBoat.pos.y + 0.5;
      return;
    }

    if (this.saved && !this.touchingPlayer && !this.g.p1.dead) {
      this.changeAnim('run');
      let adjustedPos = this.g.p1.pos.copy();
      const direction = adjustedPos.subtract(this.pos).normalize();
      this.velocity = direction.scale(this.followSpeed);
      this.mirror = this.velocity.x < 0;
      this.collideTiles = (this.velocity.y < 0.01);
    } else {
      this.changeAnim('idle');
    }
  }

  render() {
    super.render();

    if (this.caged) {
        drawTile(
          vec2(this.pos.x, this.pos.y+.25),
          vec2(1+.5),
          tile(35, vec2(8,8))
        );
    } else if(!this.inBoat && this.dist > 15) {
      let x = clamp(this.pos.x, cameraPos.x - 14, cameraPos.x + 14),
          y = clamp(this.pos.y, cameraPos.y - 12, cameraPos.y + 12);
      drawTile(vec2(x, y), vec2(1), tile(46,vec2(8)));
    }
  }

  collideWithObject(o) {
    if (o.constructor.name === 'Player' && this.caged) {
      this.caged = false;
      if (this.help) { this.help.destroy(); }
      this.makeDebris(this.pos, 'poop', 3, .7, .5, 1, 37);
      this.g.sfx.play('smash', this.pos);
      // o.destroy();
    }
    if (o.constructor.name === 'Player' && !this.caged && !this.saved) {
      this.saved = true;
      this.g.saved += 1;
      this.g.sfx.play('score', this.pos);
      const t = ['THANKS!', 'OHAI!', 'MY HERO!', 'FINALLY!', 'FREEDOM!'];
      this.speech = new Speech(this, t.rnd());
    }
    if (o.constructor.name === 'Player') {
      this.touchingPlayer = true;
    }
    // if (o.constructor.name === 'Drone') {
    //   this.g.sfx.play('hurt', this.pos);
    //   this.g.animals -= 1;
    //   this.g.achieved.lost.push(this.name);
    //   this.destroy();
    // }

    if (o.constructor.name === 'Boat' && !this.inBoat) {
      this.changeAnim('idle');
      this.inBoat = o;
      this.g.inBoat += 1;
      this.passenger = o.passengers;
      o.passengers += 1;
      this.speech = new Speech(this, 'YAY!');
      this.g.sfx.play('score', this.pos);
      this.g.achieved.saved.push(this.name);

    }
  }
}
