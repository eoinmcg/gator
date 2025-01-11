import Splash from "../scenes/splash.js";
import Credits from "../scenes/credits.js";
import Pretutorial from "../scenes/pretutorial.js";
import Tutorial from "../scenes/tutorial.js";
import Title from "../scenes/title.js";
import MissionStart from "../scenes/missionStart.js";
import MissionFinish from "../scenes/missionFinish.js";
import Victory from "../scenes/victory.js";
import Main from "../scenes/main.js";

const Scenes = {
  'Splash': Splash,
  'Credits': Credits,
  'Pretutorial': Pretutorial,
  'Tutorial': Tutorial,
  'Title': Title,
  'MissionStart': MissionStart,
  'MissionFinish': MissionFinish,
  'Victory': Victory,
  'Main': Main,
}

export default class SceneManager {
  constructor(Game) {
    this.g = Game;
    this.currentScene = null;
    this.lastChange = 500;
  }

  changeScene(newScene, effect = 'complete', force = false) {
    const delta = new Date().getTime() - this.lastChange;
    if (!force && delta < 1000) {
      return;
    }

    this.g.music.clear();
    this.lastChange = new Date().getTime();
    document.body.classList.add(effect);

    window.setTimeout(() => {
    if (this.currentScene) {
      this.currentScene.exit();
    }
      engineObjectsDestroy();
      this.clearInput();
      document.body.classList.remove(effect);
      this.currentScene = new Scenes[newScene];
      this.currentScene.enter(this.g);
    }, 250);
  }

  update() {
    if (this.currentScene) {
      this.currentScene.update();
    }
  }

  updatePost() {
    if (this.currentScene) {
      this.currentScene.updatePost();
    }
  }

  render() {
    if (this.currentScene) {
      this.currentScene.render();
    }
  }

  renderPost() {
    if (this.currentScene) {
      this.currentScene.renderPost();
    }
  }

  clearInput() {

    // clear keys
    for (let key in keyIsDown) {
        keyIsDown[key] = false;
    }

    // clear mouse
    // mouseIsDown = false;
    // mousePos = new Vector2(0, 0);

    // clear gamepads
    // for (let i = 0; i < gamepads.length; i++) {
    //     if (gamepads[i]) {
    //         gamepads[i].buttons.forEach(button => button.pressed = false);
    //         gamepads[i].axes.forEach((axis, index) => gamepads[i].axes[index] = 0);
    //     }
    // }

    // clear touch
    // touches.length = 0;
  }
}
