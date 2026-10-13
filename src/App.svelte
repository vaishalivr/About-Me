<script>
  import { onMount } from "svelte";
  import { linePath } from "./linePath.js";

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
  <div class="line-viewport" aria-label="Centered custom path section">
    <svg
      class="line-svg"
      viewBox="0 0 5637 600"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Custom path"
    >
      <circle class="start-marker" cx="0" cy="297.206" r="6" />
      <circle class="end-marker" cx="5637" cy="299.206" r="6" />
      <path class="line-path" d={linePath} />
    </svg>
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

  .line-viewport {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: max-content;
    min-width: 100vw;
    height: 100vh;
  }

  .line-svg {
    display: block;
    width: 5637px;
    height: 600px;
    overflow: visible;
  }

  .start-marker,
  .end-marker {
    fill: #111;
  }

  .line-path {
    fill: none;
    stroke: #111;
    stroke-width: 3;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
</style>
