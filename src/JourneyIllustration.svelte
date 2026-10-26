<script>
  import { onMount } from "svelte";
  import { linePath } from "./linePath.js";
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
      >and these are my thoughts when i see a design brief</text
    >

    <g transform="translate(30 297.206)">
      <text
        class="scribble-caption"
        dy="-1.375rem"
        dominant-baseline="text-after-edge"
      >Hi, I'm</text>
      <text
        class="scribble-caption"
        dy="1.375rem"
        dominant-baseline="text-before-edge"
      >Vaishali</text>
    </g>
    <circle class="start-marker" cx="30" cy="297.206" r="6" />
    <g transform="translate(1908 298.893)">
      <circle class="start-marker" r="6" />
      <text
        class="scribble-caption"
        dy="1.375rem"
        dominant-baseline="text-before-edge"
      >
        <tspan x="0rem">because I do the thinking</tspan>
        <tspan x="0rem" dy="1.8rem">without prompting.</tspan>
      </text>
    </g>
    <g transform="translate(2358 298.916)">
      <circle class="start-marker" r="6" />
      <text
        class="scribble-caption"
        dy="1.375rem"
        dominant-baseline="text-before-edge"
      >
        <tspan x="0rem">and takes responsibility</tspan>
        <tspan x="0rem" dy="1.8rem">for making the thing that works</tspan>
        <tspan x="0rem" dy="1.8rem">• within your framework</tspan>
        <tspan x="0rem" dy="1.8rem">• improves your product</tspan>
        <tspan x="0rem" dy="1.8rem">• impacts your business outcomes</tspan>
        <tspan x="0rem" dy="1.8rem">• gives a good RoI</tspan>
      </text>
    </g>
    <g transform="translate(2808 298.939)">
      <circle class="start-marker" r="6" />
      <text
        class="scribble-caption"
        dy="1.375rem"
        dominant-baseline="text-before-edge"
      >
        <tspan x="0rem">I analyse your data and</tspan>
        <tspan x="0rem" dy="1.8rem">sketch out a design that</tspan>
        <tspan x="0rem" dy="1.8rem">will work to solve your problem</tspan>
      </text>
    </g>
    <g transform="translate(3258 298.962)">
      <circle class="start-marker" r="6" />
      <text
        class="scribble-caption"
        dy="1.375rem"
        dominant-baseline="text-before-edge"
      >
        <tspan x="0rem">design is the major skill</tspan>
        <tspan x="0rem" dy="1.8rem">along with data analysis</tspan>
        <tspan x="0rem" dy="1.8rem">and writing code</tspan>
      </text>
    </g>
    <g transform="translate(3708 298.984)">
      <circle class="start-marker" r="6" />
      <text
        class="scribble-caption"
        dy="1.375rem"
        dominant-baseline="text-before-edge"
      >
        <tspan x="0rem">my work fits well within</tspan>
        <tspan x="0rem" dy="1.8rem">these agencies:</tspan>
        <tspan x="0rem" dy="1.8rem">• newsrooms/publications</tspan>
        <tspan x="0rem" dy="1.8rem">• non-profits/foundations</tspan>
        <tspan x="0rem" dy="1.8rem">• research institutions</tspan>
        <tspan x="0rem" dy="1.8rem">• early stage startups</tspan>
        <tspan x="0rem" dy="1.8rem">• creative agencies</tspan>
        <tspan x="0rem" dy="1.8rem">• design teams</tspan>
        <tspan x="0rem" dy="1.8rem">but not limited to these</tspan>
      </text>
    </g>
    <g transform="translate(4158 299.007)">
      <circle class="start-marker" r="6" />
      <text
        class="scribble-caption"
        dy="1.375rem"
        dominant-baseline="text-before-edge"
      >
        <tspan x="0rem">In the past I have been:</tspan>
        <tspan x="0rem" dy="1.8rem">• architect</tspan>
        <tspan x="0rem" dy="1.8rem">• design coordinator</tspan>
        <tspan x="0rem" dy="1.8rem">• freelance content designer</tspan>
        <tspan x="0rem" dy="1.8rem">• freelance information designer</tspan>
        <tspan x="0rem" dy="1.8rem">• data visualization developer</tspan>
        <tspan x="0rem" dy="1.8rem">• data visualization designer and developer</tspan>
        <tspan x="0rem" dy="1.8rem">• back to freelancing again</tspan>
      </text>
    </g>
    <g class="venn-diagram" role="img" aria-label="Three overlapping circles with a fourth circle in the center">
      <circle cx="5290" cy="210" r="105" />
      <circle cx="5213" cy="344" r="105" />
      <circle cx="5367" cy="344" r="105" />
      <circle cx="5290" cy="299.206" r="65" />
    </g>
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

  .venn-diagram {
    fill: none;
    stroke: #111;
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
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
