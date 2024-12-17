import Scene from "./scene";
import drawSky from "../helpers/drawSky";
import drawWeather from "../helpers/drawWeather";

export default class Credits extends Scene {

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
    }

  }

  render() {

    drawSky('night', ['moon']);
    drawWeather['stars']();

    this.g.fonts.black.drawTextScreen(`Code & GFX by eoinmcg`, vec2(154, 304), 4, false);
    this.g.fonts.grass.drawTextScreen(`Code & GFX by eoinmcg`, vec2(150, 300), 4, false);

    this.g.fonts.black.drawTextScreen(`Music by snabisch`, vec2(154, 404), 4, false);
    this.g.fonts.yellow.drawTextScreen(`Music by snabisch`, vec2(150, 400), 4, false);

    this.g.fonts.black.drawTextScreen(`Made with LittleJS`, vec2(154, 504), 4, false);
    this.g.fonts.pink.drawTextScreen(`Made with LittleJS`, vec2(150, 500), 4, false);

  }
}

