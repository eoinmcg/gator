export default class Scene {
  enter(game) {
    this.g = game;
  }

  exit() { }

  update() {

    if (keyWasPressed('KeyM')) {
      this.g.sfx.toggleMute();
      this.g.music.toggleMute();
    }

    this.skip = false;
    if (mouseWasReleased(0)
      || keyWasReleased('KeySpace')
      || keyWasReleased('KeyEnter')
      || keyWasReleased('KeyX')
      || keyWasReleased('KeyZ')
      || gamepadWasReleased(2)
      || gamepadWasReleased(0)) {
      this.skip = true;
    }


  }

  updatePost() { }

  render() { }

  renderPost() {
  }

}
