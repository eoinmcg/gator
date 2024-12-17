export default function colorFont(col, image) {

  let w = image.width, h = image.height;
  let c = mkCanvas(w, h);
  let ctx = c.getContext('2d');

  ctx.fillStyle = col;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "destination-in";

  ctx.drawImage(image, 0, 0);

  let img = new Image();
  img.src = c.toDataURL();

  return img;
}

function mkCanvas(w, h) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');

  c.width = w;
  c.height = h;

  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  return c;
}
