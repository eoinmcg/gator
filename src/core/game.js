import Loader from "../levels/loader.js";
import SceneManager from "./sceneManager.js";

import palette from "../data/palette.js";
import Sfx from "../data/sfx.js";
import Music from '../data/music.js';

import colorFont from "../helpers/colorFont.js";

const Game = {
  W: 960,
  H: 800,
  Loader: new Loader(),
  sfx: new Sfx(),
  music: new Music(),
  palette: palette,
  score: 0,
  p1: null,
  gameOver: false,
  level: null,
  levelNum: 5,
  startScene: 'MissionStart',
  images: ['sprites.png', 'tiles.png', 'splash3.png']
};

let font = new FontImage;
font.image.onload = () => {
  let cols = ['white', 'gray', 'red', 'black', 'yellow', 'grass', 'pink', 'orange'];
  Game.fonts = {};
  cols.forEach((col) => {
    let image = colorFont(palette[col].hex, font.image);
    Game.fonts[col] = new FontImage(image);
  });
}

const sceneManager = new SceneManager(Game);
Game.sceneManager = sceneManager;

gravity = -.01;
tileFixBleedScale = .1;
touchInputInit();
touchGamepadEnable = true;

if (window.BUILD) {
  setShowWatermark(false);
  setShowSplashScreen(true);
} else {
  window.G = Game;
}

export default Game;

// naughty, naughty
Array.prototype.rnd = function () {
  return this[Math.floor((Math.random()*this.length))];
}
