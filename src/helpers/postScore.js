import keys from "../data/keys";

export default function postScore(score, game) {

  // if (!game.isNewgrounds || score === 0) { return; }

  game.ng.postScore(keys.ScoreBoard, score);

}
