
export default function moveCamera(target, tileData, levelSize) {
    // Calculate the new camera position
    const lerpFactor = 0.1;
    const targetPos = target.pos;
    const currentPos = cameraPos;
    const newPos = vec2(
        currentPos.x + (targetPos.x - currentPos.x) * lerpFactor,
        currentPos.y + (targetPos.y - currentPos.y) * lerpFactor
    );

  if (newPos.x < 25) newPos.x = 25;
  if (newPos.x > 32) newPos.x = 32;
  if (newPos.y < 12.5) newPos.y = 12.5;
  if (newPos.y > levelSize.y) newPos.y = levelSize.y;

    setCameraPos(newPos);
}
