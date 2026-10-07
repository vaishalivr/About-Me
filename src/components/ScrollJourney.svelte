<script>
  import { onMount, tick } from "svelte";
  import LineArtwork from "./LineArtwork.svelte";
  import SceneItems from "./SceneItems.svelte";
  import { scene } from "../scene.js";
  import { clamp, journeyGeometry } from "../journey.js";
  let section;
  let viewport;
  let viewportWidth = 1;
  let viewportHeight = 1;
  let compositionWidth = 6000;
  let distance = 0;
  let scrollDistance = 0;
  let travel = 0;
  let still = false;
  // Expose scroll travel only after the opening; early input cannot skip the scribble.
  let openingDone = false;
  let toggleView = () => {};
  $: progress = distance ? travel / distance : 0;
  $: items = scene.showPlaceholders ? scene.items : [];

  onMount(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let alive = true;
    let scrollFrame = 0;
    const updateScroll = () => {
      scrollFrame = 0;
      if (!alive || still) return;
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      travel = clamp(
        (window.scrollY - sectionTop) / scene.scrollDistanceMultiplier,
        0,
        distance,
      );
    };
    const scheduleScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    };
    const measure = () => {
      viewportWidth = document.documentElement.clientWidth;
      viewportHeight = viewport.getBoundingClientRect().height;
      ({ compositionWidth, distance, scrollDistance } = journeyGeometry(
        scene,
        viewportWidth,
        viewportHeight,
      ));
      tick().then(() => {
        if (alive) updateScroll();
      });
    };
    const setView = (value) => {
      still = value;
      tick().then(() => {
        if (alive) measure();
      });
    };
    toggleView = () => setView(!still);
    const motionChange = () => setView(preference.matches);
    still = preference.matches;
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("scroll", scheduleScroll, { passive: true });
    window.addEventListener("resize", measure);
    preference.addEventListener("change", motionChange);
    measure();
    return () => {
      alive = false;
      cancelAnimationFrame(scrollFrame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleScroll);
      window.removeEventListener("resize", measure);
      preference.removeEventListener("change", motionChange);
    };
  });
</script>

<section
  bind:this={section}
  data-phase={still ? "still" : openingDone ? "scroll" : "opening"}
  class:still
  style:height={still ? "auto" : `${(openingDone ? scrollDistance : 0) + viewportHeight}px`}
  aria-label="Follow a continuous thread through a horizontal landscape"
>
  <div bind:this={viewport} class="viewport">
    <header>
      <button onclick={() => toggleView()} aria-pressed={still}
        >{still ? "Scroll experience" : "Still view"}
        <span aria-hidden="true">↗</span></button
      >
    </header>
    <div
      class="composition"
      style:width={still ? "100%" : `${compositionWidth}px`}
      style:transform={still ? "none" : `translate3d(${-travel}px,0,0)`}
    >
      <h1 class="introduction" style:left={still ? '0.5%' : `${30 / scene.width * compositionWidth}px`}>
        <span class="greeting">Hi, I'm</span>
        <span class="name">Vaishali Verma</span>
      </h1>
      <LineArtwork width={scene.width} height={scene.height} {progress} {still} onOpeningComplete={() => openingDone = true} />
      {#if !still}<SceneItems
          {items}
          {scene}
          scaleX={compositionWidth / scene.width}
          {viewportWidth}
          {travel}
          reducedMotion={still}
        />{/if}
    </div>
    {#if still}<div class="reading">
        <p class="tiny">THE JOURNEY · STILL VIEW</p>
        {#each items as item (item.id)}<article>
            <p class="tiny">{item.eyebrow}</p>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>{/each}
      </div>{/if}
    <footer>
      <div class="scroll-cue">
        <span aria-hidden="true">↓</span><span
          >{still
            ? "TAKE YOUR TIME"
            : !openingDone
              ? "FOLLOWING THE THREAD"
            : progress > 0.99
              ? "YOU’VE FOLLOWED THE THREAD"
              : "SCROLL TO FOLLOW THE THREAD"}</span
        >
      </div>
      <div class="progress" aria-hidden="true">
        <span class="number"
          >{String(Math.min(4, Math.floor(progress * 4)) + 1).padStart(
            2,
            "0",
          )}</span
        ><span class="rail"
          ><span style:width={`${progress * 100}%`}></span></span
        ><span class="total">05</span>
      </div>
    </footer>
  </div>
</section>

<style>
  section {
    position: relative;
  }
  .viewport {
    height: 100svh;
    position: sticky;
    top: 0;
    overflow: hidden;
    background: #fff;
  }
  header,
  footer {
    position: absolute;
    z-index: 2;
    left: 3rem;
    right: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  header {
    top: 2.4rem;
    justify-content: flex-end;
  }
  .tiny,
  footer {
    font-size: 0.6rem;
    letter-spacing: 0.14em;
  }
  button {
    border: 0;
    background: none;
    color: #555;
    font: inherit;
    font-size: 0.7rem;
    cursor: pointer;
    padding: 0.5em;
  }
  button span {
    margin-left: 1em;
  }
  button:focus-visible {
    outline: 2px solid #555;
    outline-offset: 0.3rem;
  }
  .introduction {
    position: absolute;
    top: 54.444444%;
    z-index: 1;
    margin: 0;
    font-family: Georgia, serif;
    font-size: clamp(1.6rem, 3.5vw, 3.6rem);
    font-weight: 400;
    letter-spacing: -0.045em;
    line-height: 1.1;
    white-space: nowrap;
  }
  .introduction span { position: absolute; left: 0; }
  .greeting { bottom: 1.3rem; }
  .name { top: 1.3rem; }
  .tiny {
    color: #8b8b8b;
  }
  .composition {
    position: absolute;
    top: 0;
    height: 100%;
    will-change: transform;
  }
  footer {
    bottom: 2.3rem;
    color: #666;
  }
  .scroll-cue {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }
  .scroll-cue > span:first-child {
    font-size: 1.3rem;
    color: #222;
  }
  .progress {
    display: flex;
    gap: 0.8rem;
    align-items: center;
  }
  .number {
    color: #222;
  }
  .total {
    color: #aaa;
  }
  .rail {
    display: block;
    width: 6rem;
    height: 1px;
    background: #ddd;
  }
  .rail > span {
    display: block;
    height: 100%;
    background: #222;
  }
  .still .viewport {
    position: relative;
    min-height: 100svh;
    height: auto;
    padding: 8rem 2rem 7rem;
  }
  .still .composition {
    position: relative;
    height: 28vh;
    min-height: 10rem;
    will-change: auto;
  }
  .reading {
    max-width: 42rem;
    margin: 3rem auto;
  }
  .reading article {
    padding: 2rem 0;
    border-bottom: 1px solid #eee;
  }
  .reading h2 {
    font:
      2rem Georgia,
      serif;
    white-space: pre-line;
  }
  .reading article > p:last-child {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.6;
  }
  @media (max-width: 600px) {
    header,
    footer {
      left: 1.5rem;
      right: 1.5rem;
    }
    header {
      top: 1.5rem;
    }
    footer {
      bottom: 1.5rem;
    }
    .scroll-cue {
      font-size: 0.5rem;
      gap: 0.5rem;
    }
    .rail {
      width: 3rem;
    }
    .progress {
      gap: 0.5rem;
    }
  }
</style>
