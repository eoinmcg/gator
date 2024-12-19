import Scene from "./scene";

export default class MissionStart extends Scene {

  enter(Game) {
    this.g = Game;
    Game.levelSize = vec2();

    const levelLoader = Game.Loader;
    this.props = levelLoader.loadProps(this.g.levelNum);
    if (!this.props) {
      this.g.sceneManager.changeScene('Victory');
      return;
    }

    setCameraPos(Game.levelSize.scale(.5));
    this.change = false;

    this.text = this.props.objective.toUpperCase().split(',');

    this.g.music.play('intro');

    this.interval = 2;
    this.timer = new Timer();
    this.timer.set(this.interval);
    this.title = 'MISSION ' + this.g.levelNum
    this.titleTyped = '';
    this.typeInterval = 0.1;
    this.typeTimer = new Timer();
    this.typeTimer.set(this.typeInterval);

    this.lines = [];
    this.lineInterval = 1;
    this.lineTimer = null;

  }

  update() {
    super.update();

    if (this.typeTimer && this.typeTimer.elapsed()) {
      this.titleTyped += this.title.charAt(this.titleTyped.length);
      this.g.sfx.play('shoot');
      if (this.title.length !== this.titleTyped.length) {
        this.typeTimer.set(this.typeInterval);
      } else {
        this.typeTimer.unset();
        this.lineTimer = new Timer();
        this.lineTimer.set(this.lineInterval);
      }
    }

    if (this.lineTimer && this.lineTimer.elapsed()) {
      if (this.lines.length < this.text.length) {
        this.lines.push(this.text[this.lines.length]);
        this.lineTimer.set(this.lineInterval);
        this.g.sfx.play('bounce');
      } else {
        this.lineTimer.unset();
      }
    }

    if (this.skip) {
      this.g.sceneManager.changeScene('Main');
    }
  }

  render() {

    if (!this.props) return;

    const wave = Math.sin(new Date().getTime() * 0.005);


    this.g.fonts.red.drawTextScreen(this.titleTyped, vec2(280, 200), 6, false);

    this.lines.forEach((line, i) => {
      let col = i > 0 ? 'pink' : 'white';
      if (i > 0 && wave < 0) {
        col = 'orange';
      }
      this.g.fonts[col].drawTextScreen(line, vec2(500, 300 + (i * 50)), 3, true);
    })

  }
}
