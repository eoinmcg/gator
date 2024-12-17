export default class Tutor {

  constructor(game) {
    // this.pos = vec2(37,2);
    this.scale = 6;
    this.g = game;
    this.fonts = game.fonts;
    this.speechTimer = new Timer();
    this.delay = 0.075;
    this.phraseSpoken = '';
    this.phrase = '';
  }

  update() {
    if (this.speechTimer.elapsed() && this.phrase !== this.phraseSpoken) {
      this.updateSpeech();
      this.speechTimer.set(this.delay);
    }
  }

  speak(phrase, clear = false) {
    this.clearText();
    this.phrase = phrase;
    this.phraseSpoken = '';
    this.speechTimer.set(this.delay);
    this.clear = clear;
  }

  updateSpeech() {

    let currentLength = this.phraseSpoken.length;
    let letter = this.phrase.charAt(currentLength);
    this.phraseSpoken = this.phraseSpoken + letter;
    this.g.sfx.play('walk');
    if (this.phraseSpoken === this.phrase && this.clear) {
      this.clearText();
    }
  }

  clearText() {
    if (!this.phrase) return;
      new FadeText(this.textPos, this.phrase, this.fonts);
      this.phrase = ''; this.phraseSpoken = '';
      console.log('DOE');
  }

  render() {
    const wave = Math.sin(new Date().getTime() * 0.01);

    let frame = 56, a = 0;

    if (this.phrase && (this.phraseSpoken !== this.phrase)) {
      frame = wave > 0 ? 56 : 57;
      a = [0.1, 0.12].rnd();
    }

let pos = this.pos;
    pos = cameraPos.add(vec2(-11, -10));
    drawTile(pos, vec2(this.scale), tile(frame, vec2(16)),
    undefined, a, true)

    let white = this.fonts.white;
    this.textPos = cameraPos.add(vec2(-14,-5));

    this.fonts.black.drawText(this.phraseSpoken, this.textPos.add(vec2(0,-.2)), .1, false);
    white.drawText(this.phraseSpoken, this.textPos, .1, false);
  }

}

class FadeText extends EngineObject {

  constructor(pos, phrase, fonts) {
    super(pos);
    this.phrase = phrase;
    this.startPos = pos.copy();
    this.fonts = fonts;
    this.opacity = 1;
  }

  update() {
    this.pos = this.pos.add(vec2(0,0.05));
    let dist = this.pos.add(this.startPos);
    if (dist.y > 5) { this.destroy(); }
    this.opacity -= 0.01;
  }

  render() {
    this.fonts.black.drawText(this.phrase, this.pos.add(vec2(0,.1)), .1, false);
    this.fonts.white.drawText(this.phrase, this.pos, .1, false);
  }

}
