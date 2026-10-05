// Pure geometry shared by the controller and its verification.
export const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
export const openingEase = (t) => t * t * (3 - 2 * t); // zero velocity at both ends
export function journeyGeometry(scene, viewportWidth, viewportHeight) {
  const compositionWidth = Math.max(
    scene.width * clamp(viewportHeight / scene.height, .55, 1),
    viewportWidth * scene.minimumScreens
  );
  const distance = compositionWidth - viewportWidth;
  const openingEnd = clamp(
    scene.opening.endpointX * compositionWidth / scene.width - viewportWidth * scene.opening.viewportAnchor,
    0, distance
  );
  return { compositionWidth, distance, openingEnd, scrollDistance: (distance - openingEnd) * scene.scrollDistanceMultiplier };
}
