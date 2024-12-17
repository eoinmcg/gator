import Scene from "./scene";

export default class Splash extends Scene {

  enter(Game) {
    this.g = Game;

    Game.levelSize = vec2();

    setCameraPos(Game.levelSize.scale(.5));
    this.change = false;
  }

  update() {
    super.update();

    if (this.skip) {
      this.g.sceneManager.changeScene('Title');
      if (!isFullscreen()) {
        try {
          toggleFullscreen();
        } catch (e) {

        }
      }
    }
  }

  render() {
    // const wave = Math.sin(new Date().getTime() * 0.005);
    // if (wave > 0) {
      this.g.fonts.white.drawText(`READY? \n Press X or Z`, cameraPos.add(vec2(0,-2)), .1, true);
    // }
  }
}

