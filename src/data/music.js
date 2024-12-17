import Tunes from "./tunes";

let instance;
export default class Music {

  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
    this.isMuted = false;
    this.tracks = Tunes;
    this.vol = 0.2;
    this.playing = null;
  }

  mute() {
    this.isMuted = true;
    this.stop();
  }

  unmute() {
    this.isMuted = false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    } else {
      this.play(this.currentTrack);
    }
  }

  play(name, vol = false) {
    if (this.isMuted || !name) { return; }

    this.clear();
    vol = (vol) ? vol : this.vol;
    this.playing = this.tracks[name].play(vol);
    this.currentTrack = name;
  }

  stop() {
    if (!this.playing) return;
    this.playing.stop();
    this.playing = null;
  }

  clear() {
    this.stop();
    this.playing = null;
    this.currentTrack = null;
  }

}
