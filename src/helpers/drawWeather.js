import palette from "../data/palette";
let skySeed = 6;

const drawWeather = {
  stars: function() {
    const random = new RandomGenerator(skySeed);
    const wave = Math.abs(Math.sin(new Date().getTime() * 0.0005));

    for (let i = 100; i--;) {
        let size = random.float(6, 1);
        let speed = random.float() < .9 ? random.float(5) : random.float(99,9);
        let color = palette.white.mk(random.float(0.7, 1));

        const extraSpace = 200;
        const w = mainCanvas.width+2*extraSpace, h = mainCanvas.height+2*extraSpace;
        const screenPos = vec2(
            (random.float(w)), (random.float(h)));

        color.a = wave + 0.5;
        mainContext.fillStyle = color;
        mainContext.fillRect(screenPos.x, screenPos.y, size, size);
    }
  },
  snow: function() {
    const random = new RandomGenerator(skySeed);
    for (let i = 500; i--;)
    {
        let size = random.float(6, 1);
        // let speed = random.float() < .9 ? random.float(5) : random.float(99,9);
        let speed = random.float(99,50);

        let color = (new Color).setHSLA(random.float(.2,-.3), random.float()**9, random.float(1,.5), random.float(.9,.3));
        
        const extraSpace = 200;
        const w = mainCanvas.width+2*extraSpace, h = mainCanvas.height+2*extraSpace;
        const screenPos = vec2(
            (random.float(w)+time*speed)%w-extraSpace,
            (random.float(h)+time*speed*random.float())%h-extraSpace);

        mainContext.fillStyle = palette.white.col;
        // mainContext.fillRect(screenPos.x, screenPos.y, size, size);
          mainContext.arc(screenPos.x, screenPos.y, size, 0, 90);
          mainContext.fill();
          mainContext.beginPath();
    }

  },
  rain: function() {
    const random = new RandomGenerator(skySeed);
    for (let i = 1e3; i--;)
    {
        let size = random.float(6, 1);
      let speedX = 200,
      speedY = 500

        
        const extraSpace = 200;
        const w = mainCanvas.width+2*extraSpace, h = mainCanvas.height+2*extraSpace;
        const screenPos = vec2(
            (random.float(w)+time*speedX)%w-extraSpace,
            (random.float(h)+time*speedY*random.float())%h-extraSpace);

        mainContext.fillStyle = palette.sky2.col;
        mainContext.fillRect(screenPos.x, screenPos.y, size, size);
    }

  },
  zooming: function() {
    const random = new RandomGenerator(skySeed);
    for (let i = 1e3; i--;)
    {
        let size = random.float(6, 1);
      let speedX = -100,
      speedY = -200

        
        const extraSpace = 500;
        const w = mainCanvas.width+2*extraSpace, h = mainCanvas.height+2*extraSpace;
        const screenPos = vec2(
            (random.float(w)+time*speedX)%w-extraSpace,
            (random.float(h)+time*speedY*random.float())%h-extraSpace);

        mainContext.fillStyle = palette.white.col;
        mainContext.fillRect(screenPos.x, screenPos.y, size, size);
    }

  },
  clouds: function (darkCol) {
    const random = new RandomGenerator(skySeed);

    for (let i = 10; i--;) {
        let size = random.float(3, 1);
        let speed = random.float() < .9 ? random.float(5) : random.float(99,9);
        // speed = random.float(5);
        speed *= size * 5;

        const extraSpace = 200;
        const w = mainCanvas.width+2*extraSpace, h = mainCanvas.height+2*extraSpace;
        // const screenPos = vec2(
        //     (random.float(w)), (random.float(h)));

        const screenPos = vec2(
            ((random.float(w)+time*speed)%w-extraSpace),
            (random.float(h)));

        drawCloud(screenPos.x, screenPos.y, size);
    }

  },
  cloudsFast: function (darkCol) {
    const random = new RandomGenerator(skySeed);

    for (let i = 10; i--;) {
        let size = random.float(3, 1);
        let speed = random.float() < .9 ? random.float(5) : random.float(99,9);
        // speed = random.float(5);
        speed *= size * 5;

        const extraSpace = 200;
        const w = mainCanvas.width+2*extraSpace, h = mainCanvas.height+2*extraSpace;
        // const screenPos = vec2(
        //     (random.float(w)), (random.float(h)));

        const screenPos = vec2(
            ((random.float(w)+time*speed)%w-extraSpace),
            (random.float(h)));

        drawCloud(screenPos.x, screenPos.y, size, 'sky2');
    }

  },
  moon: function(darkCol) {
      mainContext.fillStyle = palette.white.mk(1);
      mainContext.arc(800, 120, 100, 0, 90);
      mainContext.fill();
      mainContext.beginPath();
      mainContext.fillStyle = darkCol;
      mainContext.arc(750, 90, 100, 0, 90);
      mainContext.fill();
      mainContext.beginPath();
  },
  sunset: function() {
      mainContext.fillStyle = palette.orange2.mk(1);
      mainContext.arc(500, 650, 200, 0, 90);
      mainContext.fill();
      mainContext.beginPath();
  }
}

function drawCloud(x, y, size, col = 'white') {
        size *= 20;

        mainContext.fillStyle = palette[col].col;
        mainContext.fillRect(x, y, size, size);
        mainContext.arc(x, y, size, 0, 90);
        mainContext.fill();

        mainContext.beginPath();
        mainContext.arc(x+size, y, size, 0, 90);
        mainContext.fill();
        mainContext.beginPath();

        mainContext.beginPath();
        mainContext.arc(x+(size / 2), y-(size/2), size, 0, 90);
        mainContext.fill();
        mainContext.beginPath();
}

export default drawWeather;
