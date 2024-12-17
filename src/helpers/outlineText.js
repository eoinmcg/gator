export default function outlineText(o) {

  const text = o.text;
  const fonts = o.fonts;

  const col = o.col || 'white';
  const shadow = o.col || 'black';
  const size = o.size || 0.17;
  const pos = o.pos || cameraPos.add(vec2(0,-2));
  const off = 0.15 || o.off;
  const center = o.center || true;

  // Generate offsets programmatically
  let offsets = [-off, 0, off]
      .flatMap(x => [-off, 0, off].map(y => (x !== 0 || y !== 0) ? vec2(x, y) : null))
      .filter(offset => offset !== null);

    // Draw each shadow offset
    offsets.forEach(offset => {
        fonts[shadow].drawText(text, pos.add(offset), size, center);
    });

    // Draw the main text
    fonts[col].drawText(text, pos, size, center);

}
