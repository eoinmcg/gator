import Game from "./core/game.js";
import resize from "./helpers/resize.js";

function gameInit() {
  resize(Game.W, Game.H);
  setCanvasPixelated(true);
  Game.sceneManager.changeScene(Game.startScene);
}

function gameUpdate() {
  Game.sceneManager.update();
}

function gameUpdatePost() {
  Game.sceneManager.updatePost();
}

function gameRender() {
  Game.sceneManager.render();
}

function gameRenderPost() {
  Game.sceneManager.renderPost();
}

engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  Game.images
);
