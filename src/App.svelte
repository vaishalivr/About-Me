<script>
  import { onMount } from "svelte";
  import { linePath } from "./linePath.js";

  const prefixSegment = "1337 285.859";
  const drawDelayMs = 300;
  let drawDurationMs = 4000;
  let pathElement;
  let app;
  let animationFrameId = 0;
  let delayTimerId = 0;
  let stoppingDistance = 0;
  let totalLength = 0;

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

  function buildPrefixPath() {
    const segmentIndex = linePath.indexOf(prefixSegment);

    if (segmentIndex === -1) {
      return linePath;
    }

    return linePath.slice(0, segmentIndex + prefixSegment.length);
  }

  const accentCards = [
    { x: 1705, y: 150, label: "newsrooms" },
    { x: 1865, y: 150, label: "non-profts/foundations" },
    { x: 2025, y: 150, label: "research institutions" },
    { x: 1705, y: 350, label: "early stage startups" },
    { x: 1865, y: 350, label: "creative agencies" },
    { x: 2025, y: 350, label: "design teams" },
  ];

  const timelineMarkers = [
    { x: 3900, textX: 3850, lines: ["Architect"], baseY: 330 },
    { x: 4050, textX: 4015, lines: ["design", "coordinator"], baseY: 270 },
    {
      x: 4200,
      textX: 4148,
      lines: ["freelance", "content", "designer"],
      baseY: 330,
    },
    {
      x: 4350,
      textX: 4290,
      lines: ["freelance", "information", "designer"],
      baseY: 270,
    },
    {
      x: 4500,
      textX: 4460,
      lines: ["data", "visualization", "developer"],
      baseY: 330,
    },
    {
      x: 4650,
      textX: 4565,
      lines: ["data visualization", "designer/developer"],
      baseY: 270,
    },
    {
      x: 4800,
      textX: 4770,
      lines: ["back to", "freelancing", "again"],
      baseY: 330,
    },
  ];

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

    totalLength = measurePathLength(linePath);
    stoppingDistance = measurePathLength(buildPrefixPath());

    if (!pathElement) {
      return () => {
        if (delayTimerId) {
          window.clearTimeout(delayTimerId);
        }
        if (animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
        }
      };
    }

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    if (prefersReducedMotion) {
      pathElement.style.opacity = "1";
      pathElement.style.strokeDasharray = `${totalLength} ${totalLength}`;
      pathElement.style.strokeDashoffset = `${totalLength - stoppingDistance}`;
      return () => {
        if (delayTimerId) {
          window.clearTimeout(delayTimerId);
        }
        if (animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
        }
      };
    }

    pathElement.style.opacity = "0";
    pathElement.style.strokeDasharray = `${totalLength} ${totalLength}`;
    pathElement.style.strokeDashoffset = `${totalLength}`;

    delayTimerId = window.setTimeout(() => {
      pathElement.style.opacity = "1";

      const startTimestamp = performance.now();

      function updateStroke(offsetTimestamp) {
        const elapsed = offsetTimestamp - startTimestamp;
        const progress = Math.min(elapsed / drawDurationMs, 1);
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
      if (delayTimerId) {
        window.clearTimeout(delayTimerId);
      }
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
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

  <div class="line-viewport" aria-label="Centered custom path section">
    <svg
      class="line-svg"
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
      <text class="scribble-caption" x="3900" y="90">I like my work too...</text
      >
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
