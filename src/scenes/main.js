import Scene from "./scene";
import Player from "../sprites/player";
import Drone from "../sprites/drone";
import Creeper from "../sprites/creeper";
import Turret from "../sprites/turret";
import Animal from "../sprites/animal";
import Boat from "../sprites/boat";
import Breakable from "../sprites/breakable";
import Donut from "../sprites/donut";
import Key from "../sprites/key";
import Alert from "../sprites/alert";
import Bubble from "../sprites/bubble";
import drawSky from "../helpers/drawSky";
import drawWeather from "../helpers/drawWeather";
import moveCamera from "../helpers/moveCamera";

import postScore from "../helpers/postScore";


const Sprites = { Player, Drone, Creeper, Turret, Animal, Breakable, Boat, Key, Donut };

export default class Main extends Scene {
  enter(Game) {

    this.g = Game;

    const levelLoader = Game.Loader;
    const level = levelLoader.load(this.g.levelNum);
    Game.levelSize = level.levelSize
    Game.tileLayer = level.tileLayer;
    Game.tileData = level.tileData;
    Game.tileInfo = level.tileInfo;
    Game.level = level.tileData;
    Game.levelProps = level.props;
    Game.numLevels = level.numLevels;
    
    this.font = new FontImage(window.redFont);
    window.font = this.font


    this.levelTimer = new Timer();
    this.levelTimer.set(Game.levelProps.time * 60);
    this.timeLeft = {mins: 0, secs: 0};

    this.g.music.play(level.props.music);
    this.sky = level.props.sky || 'day';
    this.skyExtras = level.props.extras || false
    this.skyExtras = (this.skyExtras) ? this.skyExtras.split(',') : [];
    this.weather = level.props.weather || false;

    this.g.animals = 0;
    this.g.baddies = 0;
    this.g.saved = 0;
    this.g.inBoat = 0;
    this.killer = false;
    this.pacifist = false;

    this.g.levelComplete = false;
    this.escapeAlert = false;

    this.fireTiles = Game.tileLayer.cache.fire;
    this.alert = undefined;

    this.g.achieved = {
      time: 0,
      kills: [],
      saved: [],
      lost: [],
    }

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
      if (o.isBaddie) {
        this.g.baddies += 1;
      }
    });

    let p = level.objects.player;
    Game.p1 = new Player(vec2(p[0], p[1]), Game);
    setCameraPos(Game.levelSize.scale(.5));

    this.restartTimer = new Timer();

  }

  update() {

    if (this.fireTiles.length && Math.random() > .9) {
      new Bubble(this.fireTiles.rnd());
    }

    if (this.g.achieved.kills.length === this.g.baddies
      && this.g.levelNum === 4
      && !this.killer) {
      this.killer = true;
      this.g.medals[3].unlock();
    }

    super.update();
    this.updateTimer();

    if (this.g.p1.dead && !this.g.gameOver) {
      this.g.gameOver = true;
      postScore(this.g.score, this.g);
      this.alert = new Alert('GAME OVER', this.g.fonts, 5, true, 'red');
      this.restartTimer = new Timer();
      this.restartTimer.set(3);
    }

    if (this.g.saved === this.g.animals && !this.escapeAlert) {
      this.escapeAlert = true;
      this.alert = new Alert('GET TO THE BOAT!', this.g.fonts, 5, false);
      this.g.sfx.play('alert');
    }

    if (this.g.animals === this.g.inBoat && !this.boat.isExiting) {
      this.boat.isExiting = true;
      this.g.music.stop();
      this.g.music.play('levelComplete');
      if (this.g.achieved.kills.length === 0
        && this.g.levelNum === 3
        && !this.pacifist) {
        this.pacifist = true;
        this.g.medals[2].unlock();
      }
      if (this.timeLeft.raw >= 165) {
        this.g.medals[1].unlock();
      }
    }

    if (this.boat.isExiting && (this.boat.pos.x < 7 || this.boat.pos.x > 48) && !this.g.levelComplete) {
      this.alert = new Alert('LEVEL COMPLETE', this.g.fonts, 5, false);
      this.g.sfx.play('alert');
      this.g.levelComplete = true;
      this.g.p1.changeAnim('victory');
      this.g.achieved.time = `${this.timeLeft.mins}:${this.timeLeft.secs}`;
      window.setTimeout(() => {
        this.g.levelNum += 1;
        this.g.music.stop();
        this.g.sceneManager.changeScene('MissionFinish');
      }, 3000);
    }

    if (this.g.gameOver && this.restartTimer.elapsed()
     && (keyIsDown('KeyX') || gamepadIsDown(2))) {
      this.g.lives = 2;
      this.g.score = 0;
      this.g.sceneManager.changeScene('Main');
    }

  }

  updatePost() {
    moveCamera(this.g.p1, this.g.tileData, this.g.levelSize);
  }
  
  render() {
    drawSky(this.sky, this.skyExtras);

    if (this.g.levelProps.sea) {
      const wave = Math.abs(Math.sin(new Date().getTime() * 0.0005)) / 10;
      for (let i = 10; i < 50; i += 1) {
        drawTile(vec2(i+(wave/2), 1.2-wave), vec2(1), tile(37, 8, 1));
      }
    }

    if (this.g.gameOver && this.restartTimer.elapsed()) {
      this.g.fonts['black'].drawText(`X TO RESTART`, cameraPos.add(vec2(0,1.3)), .15, true);
      this.g.fonts['white'].drawText(`X TO RESTART`, cameraPos.add(vec2(0,1.5)), .15, true);

    }

  }

  renderPost() {
    const wave = Math.sin(new Date().getTime() * 0.005);
    const Game = this.g, palette = Game.palette;

    if (this.weather) {
      drawWeather[this.weather]();
    }

    const col = (this.timeLeft.raw < 20 && wave > 0)
      ? 'red' : 'white';
    this.g.fonts.black.drawText(`${this.timeLeft.mins}:${this.timeLeft.secs}`, cameraPos.add(vec2(0,11.37)), .15, true);
    this.g.fonts[col].drawText(`${this.timeLeft.mins}:${this.timeLeft.secs}`, cameraPos.add(vec2(0,11.5)), .15, true);
    for (let lives = 0; lives < Game.lives; lives += 1) {
      drawTile(cameraPos.add(vec2((lives * 1.3) - 13.5 ,9.4)),
        vec2(1),
        tile(34, vec2(8))
      );
    }
    for (let keys = 0; keys < Game.p1.keys; keys += 1) {
      drawTile(cameraPos.add(vec2((keys * 1.3) - 13.5,8.4)),
        vec2(1),
        tile(100, vec2(8))
      );
    }

    let x = Game.p1.jetpackEnergy * 5;
    let base = 11;
    drawRect(cameraPos.add(vec2(-11.5,base)), vec2(5.5, 1.1), palette.black.col);
    drawRect(cameraPos.add(vec2(-14 + (x / 2),base)), vec2(x, .75), palette.forest.col);
    drawRect(cameraPos.add(vec2(-14 + (x / 2),base+.25)), vec2(x, .2), palette.white.mk(.25));
    drawRect(cameraPos.add(vec2(-14 + (x / 2),base-.25)), vec2(x, .25), palette.black.mk(.2));


  }

  exit() {
    this.g.Loader.clear();
    this.g.gameOver = false;
  }

  updateTimer() {
    if (this.g.levelComplete) { return; }

    let raw = ~~(this.levelTimer.get()) * -1,
    mins = Math.max(0, (~~(raw / 60))),
    secs = Math.max(0, ((raw % 60)));


    this.timeLeft.raw = raw;
    this.timeLeft.mins = (mins+'').padStart(2, 0);
    this.timeLeft.secs = (secs+'').padStart(2, 0);

    if (this.timeLeft.raw < 0 && this.levelTimer) {
      this.levelTimer.unset();
      this.g.music.stop();
      this.alert = new Alert('TIME UP!', this.g.fonts, 0, true, 'red');
      this.restartTimer.set(3);
      this.g.p1.dead = true;
      this.g.gameOver = true;
      postScore(this.g.score, this.g);
    }
  }
}



