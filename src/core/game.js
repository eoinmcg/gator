import Loader from "../levels/loader.js";
import SceneManager from "./sceneManager.js";

import palette from "../data/palette.js";
import Sfx from "../data/sfx.js";
import Music from '../data/music.js';

import colorFont from "../helpers/colorFont.js";

import { newgroundsInit } from "../lib/newgrounds.js";
import keys from "../data/keys.js";

let newgrounds = newgroundsInit(keys.AppID, keys.EncryptionKey);
let scoreboard = newgrounds.getScores(keys.ScoreBoard);
console.log(scoreboard);

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
  levelNum: 1,
  startScene: 'Splash',
  images: ['sprites.png', 'tiles.png', 'splash3.png'],
  isNewgrounds: window.location.hostname === 'uploads.ungrounded.net',
  scoreboard: scoreboard.result.data.scores,
  ng: newgrounds
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
  window.NG = newgrounds;
  const params = Object.fromEntries(new URLSearchParams(location.search))
  if(params.levelNum) {
    Game.levelNum = parseInt(params.levelNum, 10);
  }
  if(params.startScene) {
    Game.startScene = params.startScene;
  }
}

export default Game;

// naughty, naughty
Array.prototype.rnd = function () {
  return this[Math.floor((Math.random()*this.length))];
}
