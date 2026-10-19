import { linePath } from "./linePath.js";

export const prefixSegment = "1337 285.859";
export const drawDelayMs = 300;
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function measurePathLength(pathData) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("d", pathData);
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";
  svg.style.width = "0";
  svg.style.height = "0";
  svg.style.overflow = "hidden";
  svg.appendChild(path);
  document.body.appendChild(svg);

  const length = path.getTotalLength();
  svg.remove();

  return length;
}

export function getPathMetrics() {
  const totalLength = measurePathLength(linePath);
  const prefixEnd = linePath.lastIndexOf(prefixSegment);
  const stoppingDistance =
    prefixEnd === -1
      ? totalLength
      : measurePathLength(linePath.slice(0, prefixEnd + prefixSegment.length));

  return { totalLength, stoppingDistance };
}

export function setupPathDraw(
  pathElement,
  { totalLength, stoppingDistance, durationMs = 4000 } = {},
) {
  const prefersReducedMotion =
    window.matchMedia?.(reducedMotionQuery)?.matches ?? false;

  if (!pathElement) {
    return () => {};
  }

  if (prefersReducedMotion) {
    pathElement.style.opacity = "1";
    pathElement.style.strokeDasharray = `${totalLength} ${totalLength}`;
    pathElement.style.strokeDashoffset = `${totalLength - stoppingDistance}`;
    return () => {};
  }

  pathElement.style.opacity = "0";
  pathElement.style.strokeDasharray = `${totalLength} ${totalLength}`;
  pathElement.style.strokeDashoffset = `${totalLength}`;

  let animationFrameId = 0;
  let timeoutId = 0;

  timeoutId = window.setTimeout(() => {
    pathElement.style.opacity = "1";

    const startTimestamp = performance.now();

    function updateStroke(offsetTimestamp) {
      const elapsed = offsetTimestamp - startTimestamp;
      const progress = Math.min(elapsed / durationMs, 1);
      const visibleLength = stoppingDistance * progress;

      pathElement.style.strokeDashoffset = `${totalLength - visibleLength}`;

      if (progress >= 1) {
        pathElement.style.strokeDashoffset = `${totalLength - stoppingDistance}`;
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateStroke);
    }

    animationFrameId = window.requestAnimationFrame(updateStroke);
  }, drawDelayMs);

  return () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
  };
}
