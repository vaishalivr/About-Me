<script>
  import { onMount } from "svelte";

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
  <div
    class="line-wrap"
    aria-label="Horizontal line with start and end markers"
  >
    <span class="marker start" aria-hidden="true"></span>
    <div class="line" aria-label="Horizontal line"></div>
    <span class="marker end" aria-hidden="true"></span>
  </div>
</div>

<style>
  :global(html, body) {
    margin: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .app {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow-x: auto;
  }

  .line-wrap {
    display: flex;
    align-items: center;
    gap: 0;
    width: max-content;
  }

  .marker {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #000;
    display: block;
    flex-shrink: 0;
  }

  .marker.start {
    margin-right: 0;
  }

  .marker.end {
    margin-left: 0;
  }

  .line {
    width: 7000px;
    height: 3px;
    background: #000;
    display: block;
  }
</style>
