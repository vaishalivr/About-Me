import { linePath } from "./linePath.js";
import {
  drawDelayMs,
  initialDrawDurationMs,
  prefixSegment,
  finalRevealDurationMs,
} from "./scrollConfig.js";

export { prefixSegment, drawDelayMs } from "./scrollConfig.js";
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

  return {
    totalLength,
    stoppingDistance,
  };
}

function getCurrentVisibleLength(pathElement, totalLength) {
  const currentOffset = Number.parseFloat(
    pathElement.style.strokeDashoffset ?? `${totalLength}`,
  );

  if (!Number.isFinite(currentOffset)) {
    return totalLength;
  }

  return totalLength - currentOffset;
}

function cancelCompletionAnimation(pathElement) {
  if (!pathElement || !pathElement.__finalRevealFrameId) {
    return;
  }

  window.cancelAnimationFrame(pathElement.__finalRevealFrameId);
  pathElement.__finalRevealFrameId = 0;
  pathElement.__finalRevealInProgress = false;
}

function beginAutoRevealToEnd(
  pathElement,
  { totalLength, startLength, durationMs = finalRevealDurationMs } = {},
) {
  if (!pathElement) {
    return;
  }

  cancelCompletionAnimation(pathElement);

  const startVisibleLength = clamp(startLength ?? totalLength, 0, totalLength);
  const startTimestamp = performance.now();

  pathElement.style.opacity = "1";
  pathElement.style.strokeDasharray = `${totalLength} ${totalLength}`;

  function updateStroke(offsetTimestamp) {
    const elapsed = offsetTimestamp - startTimestamp;
    const progress = Math.min(elapsed / durationMs, 1);
    const visibleLength =
      startVisibleLength + (totalLength - startVisibleLength) * progress;

    pathElement.style.strokeDashoffset = `${totalLength - visibleLength}`;

    if (progress >= 1) {
      pathElement.style.strokeDashoffset = "0";
      pathElement.__finalRevealFrameId = 0;
      pathElement.__finalRevealInProgress = false;
      return;
    }

    pathElement.__finalRevealFrameId =
      window.requestAnimationFrame(updateStroke);
  }

  pathElement.__finalRevealInProgress = true;
  pathElement.__finalRevealFrameId = window.requestAnimationFrame(updateStroke);
}

export function setPathReveal(
  pathElement,
  { totalLength, stoppingDistance, revealProgress = 0, atScrollEnd = false } = {},
) {
  if (!pathElement) {
    return;
  }

  const currentVisibleLength = getCurrentVisibleLength(
    pathElement,
    totalLength,
  );

  if (revealProgress < 1 && !atScrollEnd) {
    cancelCompletionAnimation(pathElement);

    const remainingLength = Math.max(0, totalLength - stoppingDistance);
    const revealDistance = remainingLength * clamp(revealProgress, 0, 1);
    const visibleLength = stoppingDistance + revealDistance;

    pathElement.style.opacity = "1";
    pathElement.style.strokeDasharray = `${totalLength} ${totalLength}`;
    pathElement.style.strokeDashoffset = `${totalLength - visibleLength}`;
    return;
  }

  if (currentVisibleLength >= totalLength - 0.5) {
    cancelCompletionAnimation(pathElement);
    pathElement.style.strokeDashoffset = "0";
    return;
  }

  if (pathElement.__finalRevealInProgress) {
    return;
  }

  beginAutoRevealToEnd(pathElement, {
    totalLength,
    startLength: currentVisibleLength,
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function setupPathDraw(
  pathElement,
  { totalLength, stoppingDistance, durationMs = initialDrawDurationMs, onComplete } = {},
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
    onComplete?.();
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
        onComplete?.();
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

    cancelCompletionAnimation(pathElement);
  };
}
