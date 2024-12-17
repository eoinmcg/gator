import Scene from "./scene";

export default class MissionFinish extends Scene {

  enter(Game) {
    this.g = Game;

    Game.levelSize = vec2();

    setCameraPos(Game.levelSize.scale(.5));
    this.change = false;

    this.text = [
      'TIME: ',
      'SAVED: ',
      'KILLED: ',
    ];

    this.g.music.play('victory');

    this.title = 'SUCCESS!';

    this.lines = [];
    this.lineInterval = 1;
    this.lineTimer = null;

    let timers = ['Time', 'Saved', 'Kills', 'Lost'];
    this.renderFrags = [];
    this.timers = {};
    timers.forEach((name, i) => {
      this.timers[name] = new Timer();
      this.timers[name].set(i * 1);
    });

    // use yer atlas, numpty!
    this.sprites = {
      'Drone': 21,
      'Creeper': 22,
      'Turret': 281,
      'Parrot': 48,
      'Bunny': 64,
      'Leopard': 80,
    }

    // let test = '{"time":"02:06","kills":["Creeper","Drone","Creeper","Drone","Creeper","Turret"],"saved":["Bunny","Leopard","Parrot","Parrot","Bunny"],"lost":[]}'
    // this.g.achieved = JSON.parse(test);
    // this.g.achieved.lost = ['Bunny', 'Parrot', 'Leopard'];
    // console.log('TEST: ', this.g.achieved);

  }

  update() {
    super.update();

    if (this.skip) {
      this.g.sceneManager.changeScene('MissionStart');
    }

    Object.keys(this.timers).forEach((timer, i) => {
      if (this.timers[timer].elapsed()) {
        this.timers[timer].unset();
        delete this.timers[timer];
        this.renderFrags.push(timer);
        this.g.sfx.play('bounce');
      }
    });

  }

  render() {

    const wave = Math.sin(new Date().getTime() * 0.005);

    if (wave > 0) {
      this.g.fonts.grass.drawTextScreen(this.title, vec2(280, 100), 7, false);
    }

    let y = 300;
    this.renderFrags.forEach((part, i) => {
        this[`render${part}`](y+(i*70), wave);
    })

  }

  renderTime(y) {
    let text = `TIME: ${this.g.achieved.time}`;
    this.g.fonts.white.drawTextScreen(text, vec2(280, y), 4, false);
  }

  renderSaved(y, wave) {
    wave / 2
    let text = `SAVED: `;
    this.g.fonts.white.drawTextScreen(text, vec2(280, y), 4, false);
    this.g.achieved.saved.forEach((key, i) => {
      let img = this.sprites[key];
      if (wave > 0) { img += 1; }
      let pos = vec2((i * 1.4) + .3, .5);
      drawTile(pos, vec2(1), tile(img, 8));
    });

  }

  renderKills(y) {
    let text = `KILLS: `;
    this.g.fonts.white.drawTextScreen(text, vec2(280, y), 4, false);
    this.g.achieved.kills.forEach((key, i) => {
      let img = this.sprites[key];
      let pos = vec2((i * 1.4) + .3, -1.7);
      drawTile(pos, vec2(1), tile(img, 8));
    });
  }

  renderLost(y) {
    let text = `LOST:`;
    if (this.g.achieved.lost.length === 0) { text += ' 0' }
    this.g.fonts.white.drawTextScreen(text, vec2(280, y), 4, false);
    this.g.achieved.lost.forEach((key, i) => {
      let img = this.sprites[key] + 3;
      let pos = vec2((i * 1.4) + -.5, -3.9);
      let col = this.g.palette.red.mk(1);
      drawTile(pos, vec2(1), tile(img, 8), col, 0, true);
    });
  }

}
