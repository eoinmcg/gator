const sounds = {
  spotted: new Sound([,.1,75,.03,.08,.17,1,1.88,7.83,,,,,.4]),
  alert: new Sound([2,.8,999,,,,,1.5,,.3,-99,.1,1.63,,,.11,.22]),
  explosion:    new Sound([2,.2,72,.01,.01,.2,4,,,,,,,1,,.5,.1,.5,.02]),
  jet: new Sound([.1,,25,.05,.3,.5,3,9,-0.01,,,,,,13,.1,.2]),
  walk:         new Sound([.3,.1,50,.005,,.01,4,,,,,,,,10,,,.5]),
  bounce: new Sound([,,129,.01,,.15,,,,,,,,5]),
  // hurt: new Sound([,,528,.01,,.48,,.6,-11.6,,,,.32,4.2]),

    hurt: new Sound([,,448,.01,.1,.3,3,.39,-0.5,,,,,,.2,.1,.08]),
  key: new Sound([.8,,444,.09,.24,.35,,3.7,,,81,.09,.03,,,,,.54,.23,.29,211]),
  medal: new Sound([,,128,,.12,.26,,4.7,,-1,-62,.06,.07,,52,,,.66,.08]),
  open: new Sound([1.1,,250,.07,.24,.26,,2,,164,211,.07,.08,,,.1,,.75,.12,.09,115]),
  respawn: new Sound([,,172,.8,,.8,1,.76,7.7,3.73,-482,.08,.15,,.14]),
  destroyObject: new Sound([.5,,1e3,.02,,.2,1,3,.1,,,,,1,-30,.5,,.5]),
  help: new Sound([2,,131,.02,.03,.02,,3,,,252,,,,,,.02,.63,.02]),
  die:          new Sound([.5,.4,126,.05,,.2,1,2.09,,-4,,,1,1,1,.4,.03]),
  jump:         new Sound([.4,.2,250,.04,,.04,,,1,,,,,3]),
  // dodge:        new Sound([.4,.2,150,.05,,.05,,,-1,,,,,4,,,,,.02]),
  // grenade:      new Sound([.5,.01,300,,,.02,3,.22,,,-9,.2,,,,,,.5]),
  score:        new Sound([,,783,,.03,.02,1,2,,,940,.03,,,,,.2,.6,,.06]),
  shoot:        new Sound([,,90,,.01,.03,4,,,,,,,9,50,.2,,.2,.01]),
  splash: new Sound([2,,94,.07,.1,.33,4,.6,1,,,,,.1,1,.1,.1,.45,.15]),
  smash: new Sound([2.1,,339,.02,.07,.09,4,.2,-7,,,,.05,1,,.1,.16,.45,.02,.03]),
  turret: new Sound([,,375,.01,.06,,2,2.3,18,-10,,,,,18,,,.56,.14]),

}
let instance;

export default class Sfx {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
    this.isMuted = false;
  }

  mute() {
    this.isMuted = true;
  }

  unmute() {
    this.isMuted = false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  play(name, pos = false) {
    if (this.isMuted) { return; }

    sounds[name].play(pos);
  }
}
