import Scene from "./scene";
import drawSky from "../helpers/drawSky";

export default class Bonus extends Scene {

  enter(Game) {
    this.g = Game;

    Game.levelSize = vec2();

    setCameraPos(Game.levelSize.scale(.5));
    this.change = false;
  }

  update() {
    if (keyIsDown('KeyX') || gamepadIsDown(2)) {
      this.g.sceneManager.changeScene('Main');
    }
  }

  render() {

    const Game = this.g,
          palette = Game.palette;

    const wave = Math.sin(new Date().getTime() * 0.005);
    drawSky(Game, 'night');

    const font = new FontImage;

    font.drawText(`G.A.T.O.R.S`, cameraPos.add(vec2(0,7)), .2, true);
    if (wave > 0) {
      font.drawText(`X to start`, cameraPos.add(vec2(0,-2)), .1, true);
    }



  }
}

