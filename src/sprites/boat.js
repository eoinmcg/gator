import Sprite from "./sprite";

export default class Boat extends Sprite {
  constructor(pos, game) {
    super(pos, vec2(3, 1))

    this.g = game;
    this.level = game.level;


    this.collideTiles = true;
    this.setCollision(true);
    this.passengers = 0;

    this.isExiting = false;
    this.mirror = this.getPosFromXCenter() < 0;

    this.tiles = [114,113,112];
    this.move = -0.05;
    if (this.getPosFromXCenter() < 0) {
      this.mirror = true;
      this.tiles = this.tiles.reverse();
      this.move *= -1;
    }

  }


  update() {

    if (this.isExiting) {
      this.pos.x += this.move;
    }


    super.update();
  }


  render() {
    let p = this.pos.copy();
    this.tiles.forEach((t, i) => {
      let x = this.tiles.length - (i + 2);
      drawTile(p.add(vec2(x,0)), vec2(1), tile(t, 8), undefined, 0, this.mirror);
    });
  }
}
