import outlineText from "../helpers/outlineText";

export default class Alert extends EngineObject {

  constructor(text, fonts, ttl = 0, blink = true, col) {

    let pos = cameraPos.add(vec2(0,-2));
    super(pos);
    this.pos = pos;

    this.blink = blink;
    this.timer = ttl > 0 ? new Timer(ttl) : false;
    this.text = text;
    this.o = 1;

    this.col = col || 'white';
    this.fonts = fonts;
  }

  update() {
    this.pos = cameraPos.add(vec2(0,6));
    if (this.timer) {
      this.pos.y += 0.1;
    }
    this.posShadow = this.pos.add(vec2(0,-.15));
    if (this.timer && this.timer.elapsed()) {
      this.destroy();
    }
  }

  render() {
    const wave = Math.sin(new Date().getTime() * 0.005);
    if (this.blink && wave > 0) { return; }

    outlineText({
      text: this.text,
      fonts: this.fonts
    });
  }

}
