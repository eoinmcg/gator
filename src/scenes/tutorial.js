import Scene from "./scene";
import Tutor from "../sprites/tutor";
import Player from "../sprites/player";
import Drone from "../sprites/drone";
import Creeper from "../sprites/creeper";
import Turret from "../sprites/turret";
import Animal from "../sprites/animal";
import Boat from "../sprites/boat";
import Breakable from "../sprites/breakable";
import Key from "../sprites/key";
import drawSky from "../helpers/drawSky";
import moveCamera from "../helpers/moveCamera";
import palette from "../data/palette";

const Sprites = { Player, Drone, Creeper, Turret, Animal, Breakable, Boat, Key };

export default class Tutorial extends Scene {

  enter(Game) {
    this.g = Game;

    const levelLoader = Game.Loader;
    const level = levelLoader.load(0);
    Game.levelSize = level.levelSize
    Game.tileLayer = level.tileLayer;
    Game.tileData = level.tileData;
    Game.tileInfo = level.tileInfo;
    Game.level = level.tileData;
    Game.levelProps = level.props;
    
    this.font = new FontImage(window.redFont);


    this.levelTimer = new Timer();
    this.levelTimer.set(Game.levelProps.time * 60);
    this.timeLeft = {mins: 0, secs: 0};

    this.g.animals = 0;
    this.g.saved = 0;
    this.g.inBoat = 0;

    this.g.levelComplete = false;
    this.escapeAlert = false;
    this.finishTimer = new Timer();

    level.objects.sprites.forEach((sprite) => {
      new Sprites[sprite[0]](vec2(sprite[1], sprite[2]), Game, sprite[3]);
      if (sprite[0] === 'Animal') {
        this.g.animals += 1;
      }
    });

    engineObjects.forEach((o) => {
      if (o.constructor.name === 'Boat') {
        this.boat = o;
      }
      if (o.constructor.name === 'Drone') {
        this.drone = o;
      }
      if (o.constructor.name === 'Animal') {
        this.animal = o;
      }
    });

    let p = level.objects.player;
    Game.p1 = new Player(vec2(p[0], p[1]), Game);
    setCameraPos(Game.levelSize.scale(.5));

    this.pointer = new Pointer(this.g);

    this.g.achieved = {
      time: 0,
      kills: [],
      saved: [],
      lost: [],
    }

    this.goals = {
      moved: false,
      shot: false,
      jet: false,
      controls: false,
      entered: false,
      hit: false,
      kill: false,
      rescue: false,
      inBoat: false,
    }


    this.tutor = new Tutor(this.g);
    // window.setTimeout(() => {
      this.tutor.speak('TRY MOVING AROUND');
    // }, 10);

    this.startX = this.g.p1.pos.x
    this.baddie = false;
    this.bunny = false;
    engineObjects.forEach((o) => {
      if (o.isBaddie) { this.baddie = o; }
      if (o.type === 'Animal') { this.bunny = o; }
      if (o.type === 'Boat') { this.boat = o; }
    });


  }

  update() {
    super.update();

    const p1 = this.g.p1;
    if (this.startX !== p1.pos.x && !this.goals.moved) {
      this.goals.moved = true;
      this.g.sfx.play('score');
    }



    if (p1.shots > 0 && !this.goals.shot) {
      this.g.sfx.play('score');
      this.goals.shot = true;
    }

    if (p1.jetpackEnergy < p1.jetpackEnergyMax && !this.goals.jet) {
      this.g.sfx.play('score');
      this.goals.jet = true;
    }

    if (this.goals.moved && this.goals.shot && this.goals.jet && !this.goals.controls) {
      this.goals.controls = true;
      this.tutor.speak('COOL!\n NOW ENTER THE BUILDING');
    }


    if (p1.pos.x < 38 && p1.pos.y > 1.5 && p1.pos.y < 3 && !this.goals.entered) {
      this.g.sfx.play('score');
      this.goals.entered = true;
      this.tutor.speak('SHOOT THAT DRONE');
      this.pointer.startTrack(this.drone);

    }

    if (this.baddie.health < 1 && !this.goals.hit) {
      this.g.sfx.play('score'); this.goals.hit = true;
      this.tutor.speak('GOOD SHOT! NOW FINISH IT!');
    }

    if (this.baddie.destroyed && !this.goals.kill) {
      this.g.sfx.play('score');
      this.goals.kill = true;
      this.tutor.speak('BOOM! NOW FLY TO THE CRATE');
      this.pointer.startTrack(this.animal);
    }

    if (!this.bunny.caged && !this.goals.saved) {
      this.g.sfx.play('score');
      this.goals.saved = true;
      this.tutor.speak('EXCELLENT! RETURN TO THE\n BOAT WITH THE BUNNY');
      this.pointer.startTrack(this.boat);
    }
    if (this.bunny.inBoat && !this.goals.inBoat) {
      this.g.sfx.play('score');
      this.goals.inBoat = true;
      this.g.music.play('victory');
      this.boat.isExiting = true;
      if (this.alert) { this.alert.destroy(); }
      this.tutor.speak(`AWESOME! YOU'RE READY!`);
      this.finishTimer.set(3);
      this.g.medals[0].unlock();
    }

    if (this.goals.inBoat && this.finishTimer.elapsed()) {
        this.g.levelNum = 1;
        this.g.sceneManager.changeScene('MissionStart');
    }

    this.tutor.update();

  }

  updatePost() {
    moveCamera(this.g.p1, this.g.tileData, this.g.levelSize);
  }

  render() {

    let x = this.g.p1.jetpackEnergy * 5;
    let base = 11;
    drawRect(cameraPos.add(vec2(-11.5,base)), vec2(5.5, 1.1), palette.black.col);
    drawRect(cameraPos.add(vec2(-14 + (x / 2),base)), vec2(x, .75), palette.forest.col);
    drawRect(cameraPos.add(vec2(-14 + (x / 2),base+.25)), vec2(x, .2), palette.white.mk(.25));
    drawRect(cameraPos.add(vec2(-14 + (x / 2),base-.25)), vec2(x, .25), palette.black.mk(.2));

    if (this.g.p1.jetpackEnergy < this.g.p1.jetpackEnergyMax) {
      let col = 'grass', text = 'Jetpack Energy';
      if (this.g.p1.jetpackEnergy < 0.5) {
        col = 'pink';
        text = 'Land to recharge!';

      }
      this.g.fonts.black.drawText(text, cameraPos.add(vec2(-7.7, base-.05)), .075, false);
      this.g.fonts[col].drawText(text, cameraPos.add(vec2(-7.7, base+.15)), .075, false);
      drawTile(cameraPos.add(vec2(-8.3, base)), vec2(1), tile(11, vec2(8)), this.g.palette[col].col, 0, true)

    }

    const wave = Math.sin(new Date().getTime() * 0.005);
    drawSky('night', ['moon', 'clouds']);


    let white = this.g.fonts.white,
        gray = this.g.fonts.gray,
        green = this.g.fonts.grass,
        font = white;

    if (!this.goals.entered) {
      font.drawText(`Controls`, vec2(40, 10), .075, false);
      font = (this.goals.moved) ? green : gray;
      font.drawText(`ARROWS / WASD`, vec2(40, 9), .075, false);
      font = (this.goals.jet) ? green : gray;
      font.drawText(`Z to fly`, vec2(40, 8), .075, false);
      font = (this.goals.shot) ? green : gray;
      font.drawText(`X to shoot`, vec2(40, 7), .075, false);
    }


    drawTile(vec2(1, 1), vec2(1), tile(12, vec2(8)))

  }


  renderPost() {
    this.tutor.render();

  }
}

class Pointer extends EngineObject {

  constructor(g) {

    super();
    this.g = g;
    this.tracking = false;
    this.timer = new Timer();
  }

  stopTrack() {
    this.tracking = false;
  }

  startTrack(o) {
    this.tracking = o;
    this.pos = this.tracking.pos.add(vec2(0, 2));
    this.g.sfx.play('alert');
    this.timer.set(3);
  }

  update() {
    this.wave = Math.sin(new Date().getTime() * 0.01);
    if (this.tracking) {
      this.pos = this.tracking.pos.add(vec2(0, 1.5));
    }
  }

  render() {

    if (!this.tracking || this.timer.elapsed()) return;
    drawTile(this.pos.add(vec2(0,this.wave / 4)), vec2(1), tile(12, vec2(8)));
  }
}

