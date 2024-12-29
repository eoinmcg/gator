import Scene from "./scene";
import Tutor from "../sprites/tutor";

export default class Pretutorial extends Scene {

  enter(Game) {
    this.g = Game;

    this.lines = [
      `OHAI! WELCOME TO\n TRAINING DAY`,
      `LET'S GET STARTED!`,
    ];
    this.tutor = new Tutor(this.g);
    this.tutor.speak(this.lines.shift());

    this.speechTime = 3;
    this.nextSpeech = new Timer();
    this.nextSpeech.set(this.speechTime);

    this.complete = false;

  }

  update() {
    super.update();


    // if (this.skip) {
    //   this.g.sceneManager.changeScene('Tutorial');
    // }

    if (this.nextSpeech.elapsed() && this.lines.length > 0) {
      this.tutor.speak(this.lines.shift());
      this.nextSpeech.set(this.speechTime);
    } else if (this.nextSpeech.elapsed() && !this.complete) {
      this.complete = true;
      this.g.sceneManager.changeScene('Tutorial');
    }
    this.tutor.update();
  }


  renderPost() {
    this.tutor.render();
  }
}

