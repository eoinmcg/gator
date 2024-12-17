import Sprite from "./sprite";

export default class Speech extends Sprite {
  constructor(parent, text = 'OHAI!') {
    super(parent.pos, vec2(1), tile(1, 8));

    this.p = parent;
    this.g = parent.g;
    this.level = parent.level;

    this.text = text;

    this.ttl = 1;
    this.gravityScale = 0;
    this.font = new FontImage;
    this.y = 1;
  }

  update() {
    super.update();
    this.y += 0.01;
    this.pos = this.p.pos.add(vec2(0, this.y));
    this.ttl -= 0.01

    if (this.ttl <= 0) {
      this.destroy();
    }
  }

  render() {
    this.font.drawText(this.text, this.pos, .075, true);
  }
}
