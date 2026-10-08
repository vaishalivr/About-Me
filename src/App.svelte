<script>
  import { onMount } from "svelte";

  const lineConfig = {
    revealRatio: 2 / 3,
    initialRevealDelayMs: 250,
    initialRevealDurationMs: 1200,
    completionDurationMs: 800,
  };

  const totalLineLength = 7000;

  let app;
  let revealWidth = 0;
  let thresholdWidth = 0;
  let autoRevealActive = false;
  let completionActive = false;
  let completionDone = false;
  let userHasScrolled = false;
  let animationFrameId = null;
  let loadTimerId = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function updateThreshold() {
    const viewportWidth = app ? app.clientWidth : window.innerWidth;
    thresholdWidth = viewportWidth * lineConfig.revealRatio;

    if (completionDone) {
      revealWidth = totalLineLength;
      return;
    }

    if (!userHasScrolled && !autoRevealActive) {
      revealWidth = clamp(thresholdWidth, 0, totalLineLength);
    }
  }

  function syncRevealFromScroll() {
    if (!app || completionActive || completionDone) return;

    const atScrollEnd = app.scrollLeft + app.clientWidth >= app.scrollWidth - 1;
    if (atScrollEnd) {
      const startValue = clamp(
        revealWidth || thresholdWidth,
        0,
        totalLineLength,
      );
      if (startValue < totalLineLength) {
        stopAutoReveal();
        beginCompletionAnimation(startValue);
      }
      return;
    }

    const scrollBasedReveal = app.scrollLeft + thresholdWidth;
    revealWidth = clamp(scrollBasedReveal, 0, totalLineLength);
  }

  function stopAutoReveal() {
    autoRevealActive = false;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function stopCompletion() {
    completionActive = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function beginInitialReveal() {
    if (!app || userHasScrolled) return;

    autoRevealActive = true;
    const startTime = performance.now();

    const animate = (now) => {
      if (!autoRevealActive) return;

      const progress = clamp(
        (now - startTime) / lineConfig.initialRevealDurationMs,
        0,
        1,
      );

      revealWidth = clamp(thresholdWidth * progress, 0, totalLineLength);

      if (progress >= 1) {
        stopAutoReveal();
        revealWidth = clamp(thresholdWidth, 0, totalLineLength);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
  }

  function beginCompletionAnimation(startValue) {
    if (completionDone || completionActive) return;

    const from = clamp(startValue ?? thresholdWidth, 0, totalLineLength);
    completionActive = true;
    const start = performance.now();
    const to = totalLineLength;
    const duration = lineConfig.completionDurationMs;

    const step = (now) => {
      if (!completionActive) return;

      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      revealWidth = clamp(from + (to - from) * eased, 0, totalLineLength);

      if (t >= 1) {
        completionActive = false;
        completionDone = true;
        revealWidth = totalLineLength;
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(step);
  }

  function handleWheel(event) {
    if (!app) return;

    event.preventDefault();
    app.scrollLeft += event.deltaY;
    userHasScrolled = true;
    stopAutoReveal();
    stopCompletion();
    syncRevealFromScroll();
  }

  function handleScroll() {
    if (!app) return;
    syncRevealFromScroll();
  }

  function handleResize() {
    updateThreshold();

    if (app) {
      syncRevealFromScroll();
    }
  }

  onMount(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (app) {
      app.scrollLeft = 0;
    }

    updateThreshold();

    loadTimerId = window.setTimeout(() => {
      beginInitialReveal();
    }, lineConfig.initialRevealDelayMs);

    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(loadTimerId);
      stopAutoReveal();
      window.removeEventListener("resize", handleResize);
    };
  });
</script>

<div
  class="app"
  bind:this={app}
  on:wheel={handleWheel}
  on:scroll={handleScroll}
>
  <div class="line-viewport" aria-label="Scrollable line reveal section">
    <div
      class="line-track"
      style="--reveal-width: {revealWidth}px; --line-length: {totalLineLength}px;"
    >
      <span class="marker start" aria-hidden="true"></span>
      <div class="line" aria-label="Horizontal line"></div>
    </div>
    <span class="marker end" aria-hidden="true"></span>
  </div>
</div>

<style>
  :global(html, body) {
    margin: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
  }

  :global(body) {
    font-family: Arial, sans-serif;
  }

  .app {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    background: #f7f7f4;
  }

  .line-viewport {
    position: relative;
    display: flex;
    align-items: center;
    width: max-content;
    min-width: 100vw;
    padding-left: 24px;
  }

  .line-track {
    position: relative;
    display: flex;
    align-items: center;
    width: var(--line-length, 7000px);
    min-width: var(--line-length, 7000px);
    clip-path: inset(0 calc(100% - var(--reveal-width, 0px)) 0 0);
    will-change: transform;
  }

  .marker {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #111;
    display: block;
    flex-shrink: 0;
    z-index: 2;
  }

  .marker.end {
    position: absolute;
    left: calc(var(--line-length, 7000px) + 24px - 12px);
    top: 50%;
    transform: translateY(-50%);
  }

  .line {
    width: var(--line-length, 7000px);
    height: 3px;
    background: #111;
    display: block;
    z-index: 1;
  }
</style>
