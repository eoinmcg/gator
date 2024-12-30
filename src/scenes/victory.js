import Scene from "./scene";
import drawSky from "../helpers/drawSky";
import outlineText from "../helpers/outlineText";
import postScore from "../helpers/postScore";

export default class Victory extends Scene {

  enter(Game) {
    this.g = Game;

    Game.levelSize = vec2();
    this.g.music.play('final');
    this.skipTimer = new Timer();
    this.skipTimer.set(5);

    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      trailingZeroDisplay: 'stripIfInteger'
    });
    this.score = this.formatter.format(this.g.score);
    postScore(this.g.score, this.g);
    this.g.medals[4].unlock();
     

  }

  update() {
    super.update();
    if (this.skip && this.skipTimer.elapsed()) {
      this.g.sceneManager.changeScene('Title');
    }
  }

  render() {
    super.update();
    const random = new RandomGenerator(2);
    drawSky('dawn');

    for (let i = -14; i < 20; i += 1) {
      drawTile(vec2(i*2, -11.5), vec2(2), tile(35, 8, 1));
    }

    const wave = Math.sin(new Date().getTime() * 0.005);
    outlineText({
      pos: cameraPos.add(vec2(0,2.7)),
      fonts: this.g.fonts,
      text: 'U DA BESTEST!',
      size: 0.2,
    });

    for (let i = 10; i--;) {
      let size = random.float(3, 1);
      const pos = vec2(
        (random.float(8,-8)), (random.float(8,-8)));
      drawTile(pos, vec2(size+wave), tile(34, vec2(8)));
    }

    drawTile(vec2(0,-9), vec2(3), tile(8, vec2(8)), undefined, 0, wave > 0);

    this.g.fonts.black.drawTextScreen(this.score, vec2(480, 755), 5, true);
    this.g.fonts.yellow.drawTextScreen(this.score, vec2(480, 750), 5, true);
  }

}
