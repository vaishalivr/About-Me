<script>
  import { onMount } from "svelte";
  import JourneyIllustration from "./JourneyIllustration.svelte";
  import { scrollDistanceForFullReveal } from "./scrollConfig.js";

  let app;
  let scrollProgress = 0;
  let atScrollEnd = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getRevealScrollDistance() {
    if (!app) {
      return scrollDistanceForFullReveal;
    }

    return Math.max(
      scrollDistanceForFullReveal,
      app.scrollWidth - app.clientWidth,
    );
  }

  function updateScrollProgress() {
    if (!app) {
      return;
    }

    const revealScrollDistance = getRevealScrollDistance();
    const maxScrollLeft = app.scrollWidth - app.clientWidth;

    scrollProgress = clamp(app.scrollLeft / revealScrollDistance, 0, 1);
    atScrollEnd = maxScrollLeft > 0 && app.scrollLeft >= maxScrollLeft - 1;
  }

  function handleWheel(event) {
    if (!app) return;

    const revealScrollDistance = getRevealScrollDistance();

    event.preventDefault();
    app.scrollLeft = clamp(
      app.scrollLeft + event.deltaY,
      0,
      revealScrollDistance,
    );
    updateScrollProgress();
  }

  onMount(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (app) {
      app.scrollLeft = 0;
      scrollProgress = 0;
    }
  });
</script>

<div
  class="app"
  bind:this={app}
  on:wheel={handleWheel}
  on:scroll={updateScrollProgress}
>
  <div class="name-label" aria-label="About Me">
    <span>About</span>
    <span>Me</span>
  </div>

  <!-- <div class="about-label" aria-label="About me section">
    <span>About</span>
    <span>Me</span>
  </div> -->

  <JourneyIllustration {scrollProgress} {atScrollEnd} />
</div>

<style>
  :root {
    --about-label-offset: 1.75rem;
  }

  .app {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    background: #f7f7f4;
    scrollbar-width: none;
  }

  .app::-webkit-scrollbar {
    display: none;
  }

  .name-label {
    position: absolute;
    left: var(--about-label-offset);
    top: var(--about-label-offset);
    z-index: 2;
    display: flex;
    flex-direction: column;
    font-size: 3rem;
    line-height: 1.1;
    letter-spacing: 0.02em;
    color: #111;
    font-weight: 700;
  }

</style>
