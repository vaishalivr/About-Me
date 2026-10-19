<script>
  import { onMount } from "svelte";
  import JourneyIllustration from "./JourneyIllustration.svelte";

  let app;

  function handleWheel(event) {
    if (!app) return;

    event.preventDefault();
    app.scrollLeft += event.deltaY;
  }

  onMount(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (app) {
      app.scrollLeft = 0;
    }
  });
</script>

<div class="app" bind:this={app} on:wheel={handleWheel}>
  <div class="name-label" aria-label="Name">
    <span>Vaishali</span>
    <span>Verma</span>
  </div>

  <div class="about-label" aria-label="About me section">
    <span>About</span>
    <span>Me</span>
  </div>

  <JourneyIllustration />
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

  .about-label {
    position: absolute;
    left: var(--about-label-offset);
    bottom: var(--about-label-offset);
    z-index: 2;
    display: flex;
    flex-direction: column;
    font-size: 3rem;
    line-height: 1.1;
    letter-spacing: 0.02em;
    color: #111;
    font-weight: 700;
  }

  .thoughts-label {
    fill: #111;
    font-size: 1.1rem;
    line-height: 1.5;
    letter-spacing: 0.08em;
    font-weight: 500;
  }

  .scribble-caption {
    fill: #111;
    font-size: 1.2rem;
    line-height: 1.5;
    letter-spacing: 0.04em;
    font-weight: 500;
  }
</style>
