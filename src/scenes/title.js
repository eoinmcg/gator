import Scene from "./scene";
import drawSky from "../helpers/drawSky";
import drawWeather from "../helpers/drawWeather";

export default class Title extends Scene {

  enter(Game) {
    this.g = Game;

    Game.levelSize = vec2();

    this.g.music.play('title');

    setCameraPos(Game.levelSize.scale(.5));
    this.change = false;

    this.options = [
      ['Play', vec2(670, 600), 'MissionStart'],
      ['Tutorial', vec2(670, 650), 'Pretutorial'],
      ['Credits', vec2(670, 700), 'Credits'],
    ];
    this.active = 0;
    this.stick = 0;
    this.stickLast = 0;
  }

  update() {
    super.update();

    this.stick = gamepadStick(0).y;
    let dir = '';
    if (this.stick > 0 && this.stickLast === 0) dir = 'up';
    if (this.stick < 0 && this.stickLast === 0) dir = 'down';

    if (keyWasPressed('ArrowUp') || dir === 'up') {
      this.g.sfx.play('score');
      this.active -= 1;
    } else if (keyWasPressed('ArrowDown') || dir === 'down') {
      this.g.sfx.play('score');
      this.active += 1;
    }

    if (this.active < 0) { this.active = this.options.length - 1; }
    if (this.active > this.options.length - 1) { this.active = 0; }

    if (keyWasPressed('KeyX') || gamepadWasPressed(0) || gamepadWasPressed(2)) {
      let scene = this.options[this.active][2];
      this.g.sfx.play('explosion');
      this.g.lives = 2;
      this.g.score = 0;
      this.g.sceneManager.changeScene(scene);
    }

    this.stickLast = this.stick;

  }

  render() {

    drawSky('night');
    drawWeather['cloudsFast']();
    const wave = Math.sin(new Date().getTime() * 0.005);

    let center = 960/2;

    this.g.fonts.gray.drawTextScreen(`GRUMPY  AL'S  TOTALLY OUTSTANDING  RESCUE`, vec2(center, 220), 2.2, true);

    this.renderImage();

    drawTile(vec2(4.5, -6.65 - (this.active * 1.6)), vec2(1), tile(11, vec2(8)))

    this.options.forEach((o, i) => {
      let col = this.active === i ? 'orange' : 'white';
      this.g.fonts.black.drawTextScreen(o[0], o[1].add(vec2(0,3)), 3, false);
      this.g.fonts[col].drawTextScreen(o[0], o[1], 3, false);
      if (this.active === i && wave > 0) {
        this.g.fonts.red.drawTextScreen(o[0], o[1], 3, false);
      }
    });


  }

  renderImage() {
    let a = [0, 0.2, 0.205,0.21];
    drawTile(vec2(-7,-9),vec2(10),tile(0, 256, 2), undefined, a[0]);

    let light = this.g.palette.red.col,
        dark = this.g.palette.black.mk(0.5),
    x = -11, y = 9, gap = 6, tileStart = 59;
    for (let i = 0; i < 'GATOR'.length; i += 1) {
      
      drawTile(vec2(x + (i*gap),y-.3), vec2(4), tile(59+i, vec2(16)),
      dark, 0, false)
      drawTile(vec2(x + (i*gap),y), vec2(4), tile(59+i, vec2(16)),
      light, 0, false)
    }
  }
}
