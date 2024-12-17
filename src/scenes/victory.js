import Scene from "./scene";

export default class Victory extends Scene {

  enter(Game) {
    this.g = Game;

    Game.levelSize = vec2();
  }

  update() {
    super.update();
  }

  render() {
      this.g.fonts.white.drawText(`YOU ROCK!`, cameraPos.add(vec2(0,-2)), .1, true);
  }

}
