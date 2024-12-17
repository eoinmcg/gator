import palette from "../data/palette";

const Particles = {

  jetpack: function(pos, mirror) {
    let red = palette.red.col,
    yellow = palette.yellow.col;
    const off = (mirror) ? .7 : -.7;
    pos = pos.add(vec2(off, -1.8));

    new ParticleEmitter(
        pos, 0,            // pos, angle
        this.size, .1, 1, 1, // emitSize, emitTime, emitRate, emiteCone
        tile(0,8),                      // tileInfo
        red, yellow,           // colorStartA, colorStartB
        red.scale(1,0), yellow.scale(1,0), // colorEndA, colorEndB
        .1, 1, .5, .2, 1,  // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, .95, 5, PI,   // damping, angleDamping, gravityScale, cone
        .2, 1, 0, 0        // fadeRate, randomness, collide, additive
    );
  },

  bounce(pos, size) {
    const color = palette.white.col;
    const color2 = palette.gray.col;
    pos = pos.add(vec2(0, -.5));
    new ParticleEmitter(
        pos, 0,            // pos, angle
        size, .1, 1, 0, // emitSize, emitTime, emitRate, emiteCone
        tile(0,8),                      // tileInfo
        color, color2,           // colorStartA, colorStartB
        color.scale(1,0), color2.scale(1,0), // colorEndA, colorEndB
        .3, .5, .5, 0, 0,  // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, 0, 0, PI,   // damping, angleDamping, gravityScale, cone
        .2, 0, 0, 0        // fadeRate, randomness, collide, additive
    );
  },

  turretsmoke: function(pos, mirror, size) {
    const off = (mirror) ? -.2 : .2;
    const color = palette.red.col;
    new ParticleEmitter(
        vec2(pos.x + off, pos.y), 0,            // pos, angle
        size, .5, 1, 0, // emitSize, emitTime, emitRate, emiteCone
        tile(0,8),                      // tileInfo
        color, color,           // colorStartA, colorStartB
        color.scale(1,0), color.scale(1,0), // colorEndA, colorEndB
        .3, 1, 1, .2, 0,  // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, .95, 0, PI,   // damping, angleDamping, gravityScale, cone
        .1, 0, 0, 0        //0fadeRate, randomness, collide, additive
    );
  },

  gunsmoke: function(pos, mirror, size = 1) {
    const off = (mirror) ? -.2 : .2;
    const color = palette.white.col;
    new ParticleEmitter(
        vec2(pos.x + off, pos.y), 0,            // pos, angle
        size, .1, 1, 0, // emitSize, emitTime, emitRate, emiteCone
        tile(0,8),                      // tileInfo
        color, color,           // colorStartA, colorStartB
        color.scale(1,0), color.scale(1,0), // colorEndA, colorEndB
        .1, .5, .5, .2, 0,  // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, .95, 0, PI,   // damping, angleDamping, gravityScale, cone
        .1, 0, 0, 0        // fadeRate, randomness, collide, additive
    );
  },

  gunhit: function(pos, color = false, time = .1) {
    color = color || palette.white.col;
    
    new ParticleEmitter(
        pos, 0,            // pos, angle
        .25, time, 100, PI, // emitSize, emitTime, emitRate, emiteCone
        tile(0,8),                      // tileInfo
        color, color,           // colorStartA, colorStartB
        color.scale(1,0), color.scale(1,0), // colorEndA, colorEndB
        .1, .5, .2, .2, .01,  // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, .95, .4, PI,   // damping, angleDamping, gravityScale, cone
        .1, .5, 0, 1        // fadeRate, randomness, collide, additive
    );

  },

  explode: function(pos, size) {
    const color = palette.red2.col;
    const color2 = palette.orange2.col;
      new ParticleEmitter(
          pos, 0,            // pos, angle
          size, .1, 200, PI, // emitSize, emitTime, emitRate, emiteCone
          tile(0,8),                      // tileInfo
          color, color2,           // colorStartA, colorStartB
          color.scale(1,0), color2.scale(1,0), // colorEndA, colorEndB
          .3, .5, 2.5, .1, .1,  // time, sizeStart, sizeEnd, speed, angleSpeed
          .99, .95, .4, PI,   // damping, angleDamping, gravityScale, cone
          .1, .5, 0, 1        // fadeRate, randomness, collide, additive
      );
  },

  damage: function(pos, size) {
      const color = palette.red.col;
      const color2 =palette.orange.col;
      new ParticleEmitter(
          vec2(pos.x, pos.y + .5), 0,            // pos, angle
          size / 2, .1, 1, 0, // emitSize, emitTime, emitRate, emiteCone
          tile(1,8),                      // tileInfo
          color, color2,           // colorStartA, colorStartB
          color.scale(1,0), color2.scale(1,0), // colorEndA, colorEndB
          .2, .5, .5, .1, 0,  // time, sizeStart, sizeEnd, speed, angleSpeed
          .99, .95, 0, PI,   // damping, angleDamping, gravityScale, cone
          .1, 0, 0, 0        // fadeRate, randomness, collide, additive
      );
  },

  splash: function(pos) {
      const color = palette.white.col;
      const color2 = palette.sky.col;
      new ParticleEmitter(
          vec2(pos.x, pos.y + .5), 0,            // pos, angle
          0, .1, 200, 1, // emitSize, emitTime, emitRate, emiteCone
          tile(1,8),                      // tileInfo
          color, color2,           // colorStartA, colorStartB
          color.scale(1,0), color2.scale(1,0), // colorEndA, colorEndB
          1, .2, .2, .12, 0.05,  // time, sizeStart, sizeEnd, speed, angleSpeed
          1, 1, 0.25, PI,   // damping, angleDamping, gravityScale, cone
          .1, .43, 0, 0        // fadeRate, randomness, collide, additive
      );
  },

  sparks: function(pos) {
      const color = palette.red.col;
      const color2 = palette.orange.col;
      new ParticleEmitter(
          vec2(pos.x, pos.y + .5), 0,            // pos, angle
          0, .1, 100, 1, // emitSize, emitTime, emitRate, emiteCone
          tile(1,8),                      // tileInfo
          color, color2,           // colorStartA, colorStartB
          color.scale(1,0), color2.scale(1,0), // colorEndA, colorEndB
          1, .2, .2, .12, 0.05,  // time, sizeStart, sizeEnd, speed, angleSpeed
          1, 1, 0.05, PI,   // damping, angleDamping, gravityScale, cone
          .1, .43, 0, 0        // fadeRate, randomness, collide, additive
      );
  },

}

export default Particles;
