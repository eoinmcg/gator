import palette from "../data/palette";
import drawWeather from "./drawWeather";

let skySeed = 6;

export default function drawSky(style = 'dawn', extras = []) {

  const w = mainCanvasSize.x,
  h = mainCanvasSize.y;

  let { light, med, dark, streak, stops } = styles[style];
  light = palette[light].hex;
  med = palette[med].hex;
  dark = palette[dark].hex;

  mainContext.fillStyle = light;
  mainContext.fillRect(0, 0, w, h);

  mainContext.fillStyle = med;
  mainContext.fillRect(0, 0, w, h / stops[0]);

  mainContext.fillStyle = dark;
  mainContext.fillRect(0, 0, w, h / stops[1]);

  mainContext.fillStyle = light;
  mainContext.fillRect(0, h / stops[0] - (streak * 2), w, streak);

  mainContext.fillStyle = med;
  mainContext.fillRect(0, h / stops[1] - (streak * 2), w, streak);

  extras.forEach((extra) => {
    drawWeather[extra](dark);
  })

}

const styles = {
  dawn: {
    light: 'flesh',
    med: 'pink',
    dark: 'red',
    streak: 10,
    stops: [1.8, 3]
  },
  dusk: {
    light: 'orange',
    med: 'red',
    dark: 'red2',
    streak: 10,
    stops: [1.8, 3]
  },
  day: {
    light: 'sky',
    med: 'sky2',
    dark: 'navy',
    streak: 10,
    stops: [1.8, 3]
  },
  night: {
    light: 'navy',
    med: 'navy2',
    dark: 'navy2',
    streak: 10,
    stops: [1.8, 3]
  },
  stormy: {
    light: 'gray2',
    med: 'gunmetal',
    dark: 'gunmetal2',
    streak: 10,
    stops: [1.8, 3]
  }
}

