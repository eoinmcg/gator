import palette from "../data/palette";
export default class Bubble extends EngineObject {

  constructor(pos) {
    // super(pos.add(vec2(0,1)), vec2(.5), tile(102, 8));
    super(pos.add(vec2(0,1)), vec2(.25), tile(1, 8));
    this.velocity = vec2(0, 0.05);
    this.gravityScale = 0;
    this.range = 3;
    this.startPos = this.pos.copy();
    this.color = palette.yellow.mk(1);
  }

  update() {

    this.color.a -= 0.01;
    this.angle += 0.01;
    this.size.add(vec2(-0.01, 0.01));
    const wave = Math.abs(Math.sin(new Date().getTime() * 0.0005));
    this.pos.x += wave / 100;

    super.update();
    if (this.pos.distance(this.startPos) > this.range) {
      this.destroy();
    }

  }

}
