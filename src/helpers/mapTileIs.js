import mapAtlas from '../levels/mapAtlas';

const mapTileIs = (key, val) => {
  return mapAtlas[key].includes(val);
}

export default mapTileIs;


