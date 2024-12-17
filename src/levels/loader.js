import tutorial from './tutorial.json';
import level0 from './level0.js';
import level1 from './level1.json';
import level2 from './level2.json';
import level3 from './level3.json';
import level4 from './level4.json';

import spriteAtlas from './spriteAtlas.js';


export default class Loader {
  constructor() {
    this.levels = [
      tutorial,
      level1,
      level2,
      level3,
      level4,
    ]
    this.numLevels = this.levels.length - 1; // exclude tutorial

    this.tileInfo = {
      wall: [1],
      glass: [2],
      platform: [3]
    }

    this.bgTileLayer = null;
    this.tileLayer = null;
  }

  loadProps(num) {

    if (!this.levels[num]) { return false; }
    const levelRaw = this.levels[num];
    const props =  {};
    levelRaw.layers[0].properties.forEach((p) => {
      props[p.name] = (p.type === 'int') ?
        parseInt(p.value, 10) : p.value;
    });
    return props;
  }

  load(num) {

    if (!this.levels[num]) { return false; }

    const levelRaw = this.levels[num];
    const bgData = chunkArray(levelRaw.layers[0].data, levelRaw.width).reverse();
    const tileData = chunkArray(levelRaw.layers[1].data, levelRaw.width).reverse();
    const spriteData = chunkArray(levelRaw.layers[2].data, levelRaw.width).reverse();
    const levelSize = vec2(tileData[0].length, tileData.length);
    const props =  {};
    levelRaw.layers[0].properties.forEach((p) => {
      props[p.name] = (p.type === 'int') ?
        parseInt(p.value, 10) : p.value;
    });

    this.bgTileLayer = new TileLayer(vec2(), levelSize, tile(0,8,1));
    this.bgTileLayer.tileInfo.size = vec2(8);
    bgData.forEach((row, y) => {
      row.forEach((val, x) => {
          drawMapTile(vec2(x,y), val - 1, this.bgTileLayer, 0);
      });
    });
    this.bgTileLayer.redraw();

    initTileCollision(levelSize);
    this.tileLayer = new TileLayer(vec2(), levelSize, tile(0,8,1));
    this.tileLayer.cache = { fire: [], water: []}
    tileData.forEach((row, y) => {
      row.forEach((val, x) => {
        val = parseInt(val, 10);
        if (val) {
          drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
        }
        if (val === 5) {
          this.tileLayer.cache.fire.push(vec2(x, y));
        } else if (val === 37) {
          this.tileLayer.cache.water.push(vec2(x, y));
        }
      })
    })
    this.tileLayer.redraw();


    return {
      numLevels: this.numLevels,
      levelSize: levelSize,
      tileData: tileData,
      bgTileLayer: this.bgTileLayer,
      tileLayer: this.tileLayer,
      tileInfo: this.tileInfo,
      objects: this.extractSprites(spriteData),
      props,
    };

  }

  clear() {
    this.bgTileLayer.destroy();
    this.tileLayer.destroy();
  }

  drawBgLayer() {

  }

  drawMainLayer() {

  }

  extractSprites(spriteData) {
    let player = '';
    const sprites = [];
    spriteData.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          y += 0.5
          let sprite = spriteAtlas[val]
          if (sprite === 'Player') {
            player = [x, y];
          } else {
            sprites.push([sprite, x, y, val]);
          }
        }
      })
    });
    return { sprites, player };
  }

}

const chunkArray = (array, chunkSize) => {
  const numberOfChunks = Math.ceil(array.length / chunkSize)

  return [...Array(numberOfChunks)]
    .map((value, index) => {
      return array.slice(index * chunkSize, (index + 1) * chunkSize)
    })
}


  const drawMapTile = (pos, i = 80, layer, collision = 1) => {
    const tileIndex = i;
    const data = new TileLayerData(tileIndex);
    layer.setData(pos, data);
    if (collision) {
      setTileCollisionData(pos, collision);
    }
  }
