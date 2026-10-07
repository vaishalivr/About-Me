// Pure geometry shared by the controller and its verification.
export const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
// Interpolate between editable scroll stops so reveal remains continuous and reversible.
export function lineRevealAt(progress, stops) {
  const position = clamp(progress);
  if (!stops?.length) return position;
  if (position <= stops[0].scroll) return clamp(stops[0].visible);
  for (let i = 1; i < stops.length; i++) {
    const start = stops[i - 1];
    const end = stops[i];
    if (position <= end.scroll) {
      const fraction = clamp((position - start.scroll) / (end.scroll - start.scroll));
      return clamp(start.visible + (end.visible - start.visible) * fraction);
    }
  }
  return clamp(stops[stops.length - 1].visible);
}
export function journeyGeometry(scene, viewportWidth, viewportHeight) {
  const compositionWidth = Math.max(
    scene.width * clamp(viewportHeight / scene.height, .55, 1),
    viewportWidth * scene.minimumScreens
  );
  const distance = compositionWidth - viewportWidth;
  return { compositionWidth, distance, scrollDistance: distance * scene.scrollDistanceMultiplier };
}
