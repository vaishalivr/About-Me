<script>
  import { onMount } from "svelte";
  import { linePath } from "./linePath.js";
  import { accentCards, timelineMarkers } from "./content.js";
  import {
    getPathMetrics,
    setPathReveal,
    setupPathDraw,
  } from "./pathAnimation.js";
  import { totalHorizontalSceneTravel } from "./scrollConfig.js";

  export let scrollProgress = 0;
  export let atScrollEnd = false;

  const { totalLength, stoppingDistance } = getPathMetrics();
  let pathElement;
  let initialDrawComplete = false;

  $: if (pathElement && initialDrawComplete) {
    setPathReveal(pathElement, {
      totalLength,
      stoppingDistance,
      revealProgress: scrollProgress,
      atScrollEnd,
    });
  }

  $: sceneTranslateX = -(scrollProgress * totalHorizontalSceneTravel).toFixed(
    2,
  );

  onMount(() => {
    return setupPathDraw(pathElement, {
      totalLength,
      stoppingDistance,
      onComplete: () => {
        initialDrawComplete = true;
      },
    });
  });
</script>

<div class="line-viewport" aria-label="Centered custom path section">
  <svg
    class="line-svg"
    style={`transform: translateX(${sceneTranslateX}px);`}
    viewBox="0 0 5637 600"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Custom path"
  >
    <text class="thoughts-label" x="720" y="30"
      >These are my thoughts on design...</text
    >
    {#each accentCards as card}
      <g>
        <rect
          class="accent-card"
          x={card.x}
          y={card.y}
          width="100"
          height="100"
          rx="12"
          ry="12"
        />
        <text
          class="card-label"
          x={card.x + 50}
          y={card.y + 56}
          text-anchor="middle"
        >
          {card.label}
        </text>
      </g>
    {/each}
    <text class="thoughts-label" x="1750" y="500"
      >...that people of the real world would want!</text
    >
    <text class="scribble-caption" x="2500" y="90">I use...</text>

    <text class="scribble-caption" x="2700" y="120">figma</text>
    <text class="scribble-caption" x="2800" y="120">python</text>
    <text class="scribble-caption" x="2900" y="120">D3.js</text>
    <text class="scribble-caption" x="3000" y="120">svelte</text>

    <text class="scribble-caption" x="2700" y="450">figma AI</text>
    <text class="scribble-caption" x="2800" y="450">codex</text>
    <text class="scribble-caption" x="2900" y="450">claude code</text>
    <text class="scribble-caption" x="3050" y="450">jev</text>

    <text class="scribble-caption" x="2700" y="500"
      >to test, iterate and bring ideas to life.</text
    >
    <text class="scribble-caption" x="3300" y="90">I like....</text>
    <text class="scribble-caption" x="3900" y="90">I like my work too...</text>
    {#each timelineMarkers as marker}
      <circle cx={marker.x} cy="299.206" r="6" fill="#111" />
      {#each marker.lines as line, index}
        <text
          class="scribble-caption"
          x={marker.textX}
          y={marker.baseY + index * 18}
        >
          {line}
        </text>
      {/each}
    {/each}

    <g>
      <rect
        class="accent-card"
        x="3300"
        y="150"
        width="100"
        height="100"
        rx="12"
        ry="12"
      />
      <text class="card-label" x="3350" y="206" text-anchor="middle">
        reading
      </text>

      <rect
        class="accent-card"
        x="3460"
        y="150"
        width="100"
        height="100"
        rx="12"
        ry="12"
      />
      <text class="card-label" x="3510" y="206" text-anchor="middle">
        cooking
      </text>

      <rect
        class="accent-card"
        x="3300"
        y="350"
        width="100"
        height="100"
        rx="12"
        ry="12"
      />
      <text class="card-label" x="3350" y="406" text-anchor="middle">
        coding
      </text>

      <rect
        class="accent-card"
        x="3460"
        y="350"
        width="100"
        height="100"
        rx="12"
        ry="12"
      />
      <text class="card-label" x="3510" y="406" text-anchor="middle">
        AIing
      </text>
    </g>

    <text class="scribble-caption" x="750" y="650"
      >— because creativity rarely follows a linear path.</text
    >
    <circle class="start-marker" cx="30" cy="297.206" r="6" />
    <circle class="end-marker" cx="5637" cy="299.206" r="6" />
    <!-- 2px difference -->
    <path bind:this={pathElement} class="line-path" d={linePath} />
  </svg>
</div>

<style>
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
    border: 1px solid #000;
    box-sizing: border-box;
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

  .start-marker,
  .end-marker {
    fill: #111;
  }

  .accent-card {
    fill: #d9d9d9;
    stroke: #000;
    stroke-width: 1;
  }

  .card-label {
    fill: #111;
    font-size: 0.72rem;
    letter-spacing: 0.03em;
    font-weight: 600;
    text-transform: lowercase;
  }

  .line-path {
    fill: none;
    stroke: #111;
    stroke-width: 3;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    opacity: 0;
    stroke-dasharray: 0 1000000;
    stroke-dashoffset: 1000000;
  }
</style>
